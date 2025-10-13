import express from "express"
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("✅ Server is alive");
});

const client = new PrismaClient();

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  try {
    const zapid = req.params.zapId;
    const body = req.body;
    console.log("ZapID received:", zapid);

    await client.$transaction(async (tx) => {
      const run = await tx.zapRun.create({
        data: { zapId: zapid, metadata: body },
      });

      await tx.zapRunOutbox.create({
        data: { zapRunId: run.id },
      });
    });

    res.json({ message: "Webhook message received" });
  } catch (err) {
    console.error("🔥 Error in webhook:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, ()=>{
      console.log("🚀 Server running on http://localhost:3000")
});