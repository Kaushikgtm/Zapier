import { Router } from "express";
import { authMiddleware } from "../middleware";
import { signinSchema, signupSchema } from "../types";
import { prismaClient } from "../db";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";

const router = Router();

router.post("/signup", async(req, res)=>{
      //@ts-ignore
      const body = req.body;
      const parsedData = signupSchema.safeParse(body);
      if(!parsedData.success){
            return res.status(411).json({
                  message: "you enter wrong datatype"
            })
      }
      const userExist = await prismaClient.user.findFirst({
            where: {
                  email: parsedData.data?.name
            }
      })
      if(userExist){
            return res.status(403).json({
                  message: "user with same name already exist"
            })
      }

      await prismaClient.user.create({
        data: {
            email: parsedData.data.username,
            password: parsedData.data.password,
            name: parsedData.data.name
        }
    })
      res.json({
            message: "user account is created successfully"
      })

})

router.post("/signin", authMiddleware, async(req, res)=>{
      //@ts-ignore
      const id = req.id;
      const body = req.body;
      const parsedData = signinSchema.safeParse(body);
      if(!parsedData.success){
            return res.status(411).json({
                  message: "you send a wrong datatype"
            })
      }
      const userExist = await prismaClient.user.findFirst({
            where: {
                  email: parsedData.data.username,
                  password: parsedData.data.password
            }
      })
      if(!userExist){
            return res.status(404).json({
                  message: "you send a wrong id/ password"
            })
      }
      //sign using jwt
      const token = jwt.sign({
            id: userExist.id
      },JWT_PASSWORD)

      res.json({
            token: token
      })
})

export const userRoute = router;