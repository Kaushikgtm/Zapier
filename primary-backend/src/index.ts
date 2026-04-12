import express from "express";
import cors from "cors";
import { userRoute } from "./routes/user";
import { zapRoute } from "./routes/zap";
import { triggerRoute } from "./routes/trigger";
import { actionRoute } from "./routes/action";

const app = express();
app.use(express.json())
app.use(cors());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/zap", zapRoute);
app.use("/api/v1/trigger", triggerRoute);
app.use("/api/v1/action", actionRoute);

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

startServer(3000);