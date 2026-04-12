import z from "zod";


export const signinSchema = z.object({
      username: z.string().min(6),
      password: z.string().min(5),
      name: z.string().min(3)
})

export const signupSchema = z.object({
      username: z.string(),
      password: z.string(),
      name: z.string()
})

export const ZapCreateSchema = z.object({
      avaliableTriggerId: z.string(),
      triggerMetadata: z.any().optional(),
      actions: z.array(z.object({
            avaliableActionID: z.string(),
            actionMetadata: z.any().optional()
      }))
})