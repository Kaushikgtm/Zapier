import { Router } from "express";
import { prismaClient } from "../db";

const router = Router();

router.post("/avaliable", async(req, res)=>{

      const availableTrigger = await prismaClient.availableTrigger.findMany({});

      res.json({
            availableTrigger
      })
})

export const triggerRoute = router;