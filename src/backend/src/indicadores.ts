import {Router, Request, Response} from "express"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()



const indicadorRoutes = Router()


indicadorRoutes.get("/", async (request: Request, response: Response) => {

    const users = await prisma.user.findMany({
        select: {
            name: true,
            id: true
        }
    })

    

    return response.status(200).json(users)
})




export {indicadorRoutes}