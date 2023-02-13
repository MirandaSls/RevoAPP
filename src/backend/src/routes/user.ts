import {Router, Request, Response} from "express"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const userRoutes = Router()

const productionURL = "https://revoapp.up.railway.app"

userRoutes.get("/", async (request: Request, response: Response) => {

    const users = await prisma.user.findMany({
        select: {
            name: true,
            id: true
        }
    })

    return response.status(200).json(users)
})

userRoutes.get("/:userId", async (request: Request, response: Response) => {
    const params = request.params

    const user = await prisma.user.findUnique({
        where: {
            id: params.userId
        },
        include: {
            events: true,
            friends: true,
            notifications: true,
            participations: true,
            sponsership: {
                include: {
                    material: true
                }
            }
        }
    })

    if(!user)
        return response.status(404).json({"Message": "Usuário não encontrado."})

    return response.status(200).json(user)
})

userRoutes.post("/search", async (request: Request, response: Response) => {
    const body = request.body

    const user = await prisma.user.findMany({
        where: {
            name: {
                contains: body.name
            }
        },
        select: {
            name: true,
            id: true,
        }
    })

    return response.status(201).json(user)
})


userRoutes.post("/singup", async (request: Request, response: Response) => {

    const body = request.body
    console.log(body)

    const doesUserExist = await prisma.user.findUnique({
        where: {
            email: body.email
        }
    })

    if(doesUserExist)
        return response.status(401).json({"Message": "Usuário ja existente"})


    const user = await prisma.user.create({
        data: {
            email: body.email,
            name: body.name,
            password: body.password,
        },
        select: {
            email: true,
            name: true,
            events: true,
            friends: true,
            birthday: true,
            id: true,
            sponsership: {
                include: {
                    material: true
                }
            }
        }
    })
       

    return response.status(201).json(user)
})

userRoutes.post("/login", async (request: Request, response: Response) => {

    const body = request.body

    const user = await prisma.user.findUnique({
        where: {
            email: body.email
        },
        include: {
            events: true,
            friends: true,
            participations: true,
            notifications: true,
            sponsership: {
                include: {
                    material: true
                }
            }
        }
    })

    if(!user)
        return response.status(404).json({"Message": "Usuário não existente"})

        //@ts-ignore
    if(user.password != body.password)
        return response.status(409).json({"Message": "Senha incorreta"})

    return response.status(302).json(user)
})

userRoutes.put("/:userId", async (request: Request, response: Response) => {

    const body = request.body
    const params = request.params

    let user = await prisma.user.findUnique({
        where: {
            id: params.userId
        },
        include: {
            events: true,
            friends: true,
            participations: true,
            notifications: true,
            sponsership: {
                include: {
                    material: true
                }
            }
        }
    })

    if(!user)
        return response.status(404).json({"Message":"Usuário não encontrado"})

    if(body.name === undefined && body.password === undefined){
        return response.status(302).json(user)
    }
    
    if(body.name.trim() === "" && body.password.trim() === ""){
        return response.status(302).json(user)

    } 

    
    if(body.name === undefined || body.name.trim() === "") {
        const user = await prisma.user.update({
            where: {
                id: params.userId
            },
            data:{

                password: body.password
            }
        })
        return response.status(201).json(user)
    } 

    
    if (body.password === undefined || body.password.trim() === ""){
        const user = await prisma.user.update({
            where: {
                id: params.userId
            },
            data:{
                name: body.name
            }
        })
        return response.status(201).json(user)
    }

})

userRoutes.get("/:userId/invite/:friendId/to/:eventId", async (request: Request, response: Response) => {
    const params = request.params

    const doesEventExist = await prisma.event.findUnique({
        where: {
            id: params.eventId
        },
    })

    if(!doesEventExist) 
        return response.status(404).json({"Message": "Evento não encontrado"})

    const isUserTheOwner = doesEventExist.authorId === params.userId

    if(!isUserTheOwner)
        return response.status(401).json({"Message": "Usuário não é o dono do evento"})


    const userTheOwner = await prisma.user.findUnique({
        where: {
            id: params.userId
        }
    })

    if(!userTheOwner)
        return response.status(404).json({"Message": "Dono do evento não existe"})

    const doesFriendExist = await prisma.user.findUnique({
        where: {
            id: params.friendId
        }
    })
    
    if(!doesFriendExist)
        return response.status(404).json({"Message": "Usuário convidado não existe"})


    await prisma.user.update({
        where: {
            id: params.friendId
        },
        data: {
            notifications: {
                create: {
                    just_for_show: false,
                    message: `<b> ${userTheOwner?.name} </b> te convidou para <b> ${doesEventExist.name} </b>`,
                    accepte_route: `${productionURL}/user/${params.friendId}/accept_invite_from/${params.userId}/to/${params.eventId}`,
                    recuse_route: `${productionURL}/user/${params.friendId}/recuse_invite_from/${params.userId}/to/${params.eventId}`
                }
            }
        }
    })

    return response.status(200).json({"Message": "Convite enviado com sucesso"})

})

userRoutes.get("/:friendId/accept_invite_from/:userId/to/:eventId", async (request: Request, response: Response)=> {

    const params = request.params

    const doesEventExist = await prisma.event.findUnique({
        where: {
            id: params.eventId
        },
    })

    if(!doesEventExist) 
        return response.status(404).json({"Message": "Evento não encontrado"})

    const doesFriendExist = await prisma.user.findUnique({
        where: {
            id: params.friendId
        }
    })
    
    if(!doesFriendExist)
        return response.status(404).json({"Message": "Usuário convidado não existe"})

    const isFriendParticipating = await prisma.event.findFirst({
        where: {
            participants: {
                some: {
                    userId: params.friendId,
                    eventId: params.eventId  
                }
            }
        }
    })

    if(isFriendParticipating)
        return response.status(302).json({"Message": "Usuário ja esta participando do evento"})

    await prisma.event.update({
        where: {
            id: params.eventId
        },
        data: {
            participants: {
                create: {
                    name: doesFriendExist.name,
                    userId: doesFriendExist.id,
                    eventName: doesEventExist.name
                }
            }
        }
    })

    await prisma.user.update({
        where: {
            id: params.userId
        },
        data: {
            notifications: {
                create: {
                    just_for_show: true,
                    message: `<b> ${doesFriendExist.name} </b> aceitou o seu convite para <b> ${doesEventExist.name} </b>`
                }
            }
        }
    })

    return response.status(201).send()
}) 

userRoutes.get("/:friendId/recuse_invite_from/:userId/to/:eventId", async (request: Request, response: Response)=> {

    const params = request.params

    const doesEventExist = await prisma.event.findUnique({
        where: {
            id: params.eventId
        },
    })

    if(!doesEventExist) 
        return response.status(404).json({"Message": "Evento não encontrado"})


    const userTheOwner = await prisma.user.findUnique({
        where: {
            id: params.userId
        }
    })

    if(!userTheOwner)
        return response.status(404).json({"Message": "Dono do evento não existe"})

    const doesFriendExist = await prisma.user.findUnique({
        where: {
            id: params.friendId
        }
    })
    
    if(!doesFriendExist)
        return response.status(404).json({"Message": "Usuário convidado não existe"})


    await prisma.user.update({
        where: {
            id: params.userId
        },
        data: {
            notifications: {
                create: {
                    just_for_show: true,
                    message: `<b> ${doesFriendExist.name} </b> recusou o seu convite para <b> ${doesEventExist.name} </b>`
                }
            }
        }
    })

    return response.status(200).send()
}) 

userRoutes.get("/:userId/add_friend/:friendId", async (request: Request, response: Response) => {
    const params = request.params

    const doesUserExist = await prisma.user.findUnique({
        where: {
            id: params.userId
        }
    })

    if(!doesUserExist) 
        return response.status(404).json({"Message": "User doesn't exixst"})


    const doesFriendExist = await prisma.user.findUnique({
        where: {
            id: params.friendId
        }
    })


    if (!doesFriendExist)
        return response.status(404).json({"Message": "Friend doesn't exixst"})
        
    
    await prisma.user.update({
        where: {
            id: params.friendId
        },
        data: {
            notifications: {
                create: {
                    just_for_show: false,
                    message: `<b> ${doesUserExist.name} </b> te enviou um pedido de amizade`,
                    accepte_route: `${productionURL}/user/${params.friendId}/accept_friend_request_from/${params.userId}`,
                    recuse_route: `${productionURL}/user/${params.friendId}/recuse_friend_request_from/${params.userId}`
                }
            }
        }
    })

    return response.status(200).json({"Message": "Pedido de amizade enviado com sucesso"})
})

userRoutes.get("/:friendId/accept_friend_request_from/:userId", async (request: Request, response: Response) => {
    const params = request.params

    const user = await prisma.user.findUnique({
        where: {
            id: params.userId
        }
    })

    if(!user)
        return response.status(404).json({"Message": "Usuário não encontrado"})

    const friend = await prisma.user.findUnique({
        where: {
            id: params.friendId
        }
    })

    if(!friend)
    return response.status(404).json({"Message": "Usuário não encontrado"})


    const isAlreadyFriend = await prisma.user.findFirst({
        where: {
            friends: {
                some: {
                    userId: params.userId,
                    friendId: params.friendId,
                }
            }
        }, 
        include: {
            friends: true
        }
    })

    console.log(isAlreadyFriend)

    if(isAlreadyFriend) 
        return response.status(404).json({"Message": "Usuário já amigo"})

    const friendData = await prisma.user.update({
        where: {
            id: params.friendId
        },
        data: {
            friends: {
                create: {
                    name: user.name,
                    friendId: params.userId,
                }
            }
        },
        include: {
            friends: true,
        }
    })

    const userData = await prisma.user.update({
        where: {
            id: params.userId
        },
        data: {
            friends: {
                create: {
                    name: friend.name,
                    friendId: params.friendId,
                }
            }
        },
        include: {
            friends: true,
        }
    })

    return response.status(201).json({friendData, userData})

})

userRoutes.get("/:friendId/recuse_friend_request_from/:userId", async (request: Request, response: Response) => {
    const params = request.params

    const friend = await prisma.user.findUnique({
        where: {
            id: params.friendId
        }
    })

    if(!friend)
        return response.status(404).json({"Message": "Amigo não encontrado"})

    await prisma.user.update({
        where: {
            id: params.userId
        },
        data: {
            notifications: {
                create: {
                    just_for_show: true,
                    message: `<b>${friend.name} </b> recusou o seu pedido de amizade`
                }
            }
        }
    })

    return response.status(200).send()

})

userRoutes.delete("/:userId/delete/:messageId", async (request: Request, response: Response) => {
    const params = request.params
    
    await prisma.user.update({
        where: { id: params.userId},
        data: {
            notifications: {
                delete: {
                    id: params.messageId
                }
            }
        }
    })

    return response.status(200).send()
})

export {userRoutes}