import { PrismaClient } from "@prisma/client";
import express from "express"
import { Kafka } from "kafkajs";

const TOPIC_NAME = "zap-events";
const client = new PrismaClient();

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(",")
})

async function main(){
    const producer = kafka.producer();
    await producer.connect();

    while(1){
        const pendingRow =  await client.zapRunOutbox.findMany({
            where: {},
            take: 10
        });
        console.log(pendingRow);

        //send pending row to kafka

        producer.send({
            topic: TOPIC_NAME,
            messages: pendingRow.map(x=>{
                return {
                    value: JSON.stringify({zapRunId: x.zapRunId, stage: 0})
                }
            })
        });

        await client.zapRunOutbox.deleteMany({
            where: {
                id: {
                    in: pendingRow.map(x=> x.id)
                }
            }
        })
        await new Promise(r=> setTimeout(r, 5000));
    }
}

main();