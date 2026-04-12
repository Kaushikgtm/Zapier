import {PrismaClient } from "@prisma/client";
import express from "express";

const app = express();
app.use(express.json());

const client = new PrismaClient();

app.post("api/v1/:zapId", async (req, res)=>{
      const userId = req.body.userId;
      const zapId = req.params.zapId;
      const body = req.body;

      await client.$transaction(async tx =>{
            const run = await tx.zapRun.create({
                  data: {
                        zapId: zapId,
                        metadata: body
                  }
            });

            await tx.zapRunOutbox.create({
                  data: {
                        zapRunId: run.id
                  }
            })
      })

      return res.json({
            message: "webhook recieved"
      })
})

const startServer = (port: number)=>{
      app.listen(port, ()=>{
            console.log(`server is listen on ${port}`)
      }).on("error", (err: any)=>{
            if(err.code === "EADDRINUSE") {
            console.log(`Port ${port} is busy, trying port ${port + 1}`)
            if(port < 3010) {  
                startServer(port + 1)
            } else {
                console.error("No available ports found between 3000-3010")
            }
        }
      })
}

startServer(3002);