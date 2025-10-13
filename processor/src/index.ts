import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";

const client = new PrismaClient();
const kafka = new Kafka({
  clientId: 'outbox-procesor',
  brokers: ['localhost:9092']
})

async function main(){
      const producer = kafka.producer();
      await producer.connect();
      while(1){
            const pendingRow = await client.zapRunOutbox.findMany({
                  where: {},
                  take: 10
            })
            producer.send({
                  topic: "zap-events",
                  messages: pendingRow.map(r=>{
                        return{
                              value: JSON.stringify({zapRunId: r.zapRunId, stage: 0})
                        }
                  })
            })
            await client.zapRunOutbox.deleteMany({
                  where:{
                        id:{
                              in: pendingRow.map(r=>r.id)
                        }
                  }
            })
      }
}

main()