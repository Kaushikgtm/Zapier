import { Router } from "express";
import { authMiddleware } from "../middleware";
import { prismaClient } from "../db";

const router = Router();

router.post("/avaliable", async(req, res)=>{

      const availableAction = await prismaClient.availableAction.findMany({});

      res.json({
            availableAction
      })
})

export const actionRoute = router;