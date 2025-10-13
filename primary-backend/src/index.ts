import express from "express"
import cors from "cors"
import { userRouter } from "./routes/user";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);

app.listen(3001, () => {
      console.log("app is running on localhost:3001")
})
