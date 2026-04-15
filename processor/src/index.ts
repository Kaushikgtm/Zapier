require("dotenv").config();
import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";

const client = new PrismaClient();
const TOPIC_NAME = "zap-events";

const kafka = new Kafka({
    clientId: "outbox-processor",
    brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(",")
});

async function main() {
    const producer = kafka.producer();
    await producer.connect();

    while (true) {
        try {
            const pendingRows = await client.zapRunOutbox.findMany({ take: 10 });

            if (pendingRows.length === 0) {
                await new Promise(r => setTimeout(r, 2000));
                continue;
            }

            await producer.send({
                topic: TOPIC_NAME,
                messages: pendingRows.map(x => ({
                    value: JSON.stringify({ zapRunId: x.zapRunId, stage: 0 })
                }))
            });

            await client.zapRunOutbox.deleteMany({
                where: { id: { in: pendingRows.map(x => x.id) } }
            });
        } catch (e) {
            console.error("processor loop error:", (e as Error).message);
            await new Promise(r => setTimeout(r, 3000));
        }
    }
}

main();
