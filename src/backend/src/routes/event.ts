import {Router, Request, Response} from "express"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const eventRouter = Router()

interface IMaterial {
    material_name: string
}

const productionURL = "https://revoapp.up.railway.app"


eventRouter.get("/", async (request: Request, response: Response) => {

    const events = await prisma.event.findMany({
        include: {
            participants: true,
            goals: true,
            recevied_goal: true,
            User: true
        }
    })

    return response.status(302).json(events)
})


eventRouter.get("/search/:eventName", async (request: Request, response: Response) => {
    const params = request.params

    const events = await prisma.event.findMany({
        where: {
            name: {
                contains: params.eventName
            }
        }
    })

    return response.status(200).json(events)

})

eventRouter.get("/:eventId", async (request: Request, response: Response) => {

    const params = request.params

    const event = await prisma.event.findUnique({
        where: {
            id: params.eventId
        },
        include: {
            participants: true,
            goals: {
                include: {
                    material: true
                }
            },
            recevied_goal: {
                include: {
                    material: true
                }
            },
            User: true
        }
    })

    if(!event)
        return response.status(404).json({"Message": "Evento não encontrado"})

    return response.status(302).json(event)
})

eventRouter.post("/create", async (request: Request, response: Response) => {
    const body = request.body

    const doesUserExist = await prisma.user.findUnique({
        where: {
            id: body.userId
        }
    })

    if(!doesUserExist)
        return response.status(404).json({"Message": "Usuário não encontrado"})

    let materials: IMaterial[] = []
    
    body.material.forEach((element: string) => {
        materials.push({material_name: element})
    });

    const date = new Date(body.date)

    const event = await prisma.event.create({
        data: {
            name: body.name,
            date: date,
            description: body.description,
            public: body.public,
            time: body.time,
            place: body.place,
            cellphone: body.phone,
            authorId: body.userId,
            goals: {
                create: {
                    money: body.money,
                    completed: false,
                    material: {
                        createMany: {
                            data: materials
                        }
                    }
                }
            },
            participants: {
                create: {
                    name: doesUserExist.name,
                    userId: body.userId,
                    eventName: body.name
                }               
            }
        },
        include: {
            participants: true,
            goals: {
                include: {
                    material: true
                }
            },
            recevied_goal: true,
            User: true
        }
    })

    await prisma.user.update({
        where: {
            id: body.userId
        },
        data: {
            events: {
                connect: {
                    id: event.id
                }
            }
        }
    })


    return response.status(201).json(event)
})


eventRouter.post("/:eventId/participate/:userId", async (request: Request, response: Response) => {

    const params = request.params

    const user = await prisma.user.findUnique({
        where: {
            id: params.userId
        }
    })

    if(!user) 
        return response.status(404).json({"Message": "Usuário não encontrado"})



    const doesEventExist = await prisma.event.findUnique({
        where: {
            id: params.eventId
        }
    })

    if(!doesEventExist)
        return response.status(404).json({"Message": "Evento não encontrado"})




    await prisma.event.update({
        where: {
            id: params.eventId
        },
        data: {
            participants: {
                create: {
                    name: user.name,
                    eventName: doesEventExist.name,
                    userId: user.id
                }
            }
        }
    })

    return response.status(201).send()
})


eventRouter.post("/:eventId/author/:authorId/sponser_from/:sponserId", async (request: Request, response: Response) => {
    const params = request.params
    const body = request.body

    if(body.money === undefined && body.material === undefined) 
        return response.status(400).jsonp({"Message": "Patrocinio invalido"})

    const doesEventExist = await prisma.event.findUnique({
        where: {
            id: params.eventId
        }
    })

    if(!doesEventExist) 
        return response.status(404).json({"Message": "Evento não encontrado"})
    



    const author = await prisma.user.findUnique({
        where: {
            id: params.authorId
        }
    })

    if(!author) 
        return response.status(404).json({"Message": "Usuário não encontrado"})



    const sponser = await prisma.user.findUnique({
        where: {
            id: params.sponserId
        }
    })

    if(!sponser) 
        return response.status(404).json({"Message": "Patrocinador não encontrado"})




    let materials: IMaterial[] = []

    body.material?.forEach((element: string) => {
        materials.push({material_name: element})
    });

    if(body.money === undefined){
        await prisma.event.update({
            where: {
                id: params.eventId
            },
            data: {
                recevied_goal: {
                    create: {
                        money: 0,
                        completed: true,
                        user: {
                            connect: {
                                id: params.authorId
                            }
                        },
                        material: {
                            createMany: {
                                data: materials
                            }
                        }
                    }
                },
            }
        })

        return response.status(201).json({"Message": "Pedido de patrocinio enviado"})
    
    } else if (body.material === undefined){
        await prisma.event.update({
            where: {
                id: params.eventId
            },
            data: {
                recevied_goal: {
                    create: {
                        money: body.money,
                        completed: true,
                        user: {
                            connect: {
                                id: params.authorId
                            }
                        }
                    }
                },
            }
        })

        return response.status(201).json({"Message": "Pedido de patrocinio enviado"})

    }

    const event = await prisma.event.update({
        where: {
            id: params.eventId
        },
        data: {
            recevied_goal: {
                create: {
                    money: body.money,
                    completed: true,
                    user: {
                        connect: {
                            id: params.authorId
                        }
                    },
                    material: {
                        createMany: {
                            data: materials
                        }
                    }
                }
            },
        },
        include: {
            recevied_goal: {
                include: {
                    material: true
                }
            }
        }
    })

    const goalId = event.recevied_goal.forEach((goal) => {
        let verifyMaterial = 0
        if(goal.money === body.money) {
            if(goal.userId === params.authorId) {
                for(let i = 0; i < goal.material.length; i++) {
                    if(goal.material[i] === materials[i]){
                        verifyMaterial++;
                    }
                }
                if(verifyMaterial === goal.material.length){
                    return goal.id
                }
            }
        }
    })

    console.log(goalId)

    await prisma.user.update({
        where: {
            id: params.authorId
        },
        data: {
            notifications: {
                create: {
                    just_for_show: false,
                    message: `<b> ${sponser.name} </b> deseja patrocinar o seu evento <b> ${doesEventExist.name} </b> | monetário: ${body.money}, material: ${materials.map(material => material.material_name)}`,
                    accepte_route: `${productionURL}/event/${params.eventId}/author/${params.authorId}/accept_sponser_from/${params.sponserId}`,
                    recuse_route: `${productionURL}/event/${params.eventId}/author/${params.authorId}/recuse_sponser_from/${params.sponserId}/goal/${goalId}`
                }
            }
        }
    })

    return response.status(201).json({"Message": "Pedido de patrocinio enviado"})

})


eventRouter.get("/:eventId/author/:authorId/accept_sponser_from/:sponserId", async (request: Request, response: Response) => {

    const params = request.params

    const author = await prisma.user.findUnique({
        where: {
            id: params.authorId
        }
    })

    const event = await prisma.event.findUnique({
        where: {
            id: params.eventId
        }
    })


    await prisma.user.update({
        where: {
            id: params.sponserId
        },
        data: {
            notifications: {
                create: {
                    just_for_show: true,
                    message: `<b> ${author?.name} </b> aceitou o seu patrocinio para <b> ${event?.name} </b>`
                }
            }
        }
    })

    return response.status(201).send()
})

eventRouter.get("/:eventId/author/:authorId/recuse_sponser_from/:sponserId/goals/:goalsId", async (request: Request, response: Response) => {

    const params = request.params

    const sponser = await prisma.user.findUnique({
        where: {
            id: params.sponserId
        }
    })

    await prisma.event.update({
        where: {
            id: params.eventId
        },
        data: {
            recevied_goal: {
                delete: {
                    id: params.goalsId
                }
            }
        }
    })

    await prisma.user.update({
        where: {
            id: params.authorId
        },
        data: {
            notifications: {
                create: {
                    just_for_show: true,
                    message: `Patrocinio de <b> ${sponser?.name} </b> foi recusado`
                }
            }
        }
    })


    return response.status(200).send()
})


export {eventRouter}