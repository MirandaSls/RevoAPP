# DOCUMENTAÇÃO DO BACKEND

# Production url: https://revoapp.up.railway.app

# Development url: http://localhost:3333

# Routas do Usuário '/user':

## *Done* GET "/"
@Request: {
    header: {
        email: string
    }
}
@Response: user

## *Done* POST "/singup"
@Request: {
    body: {
        email: string,
        name: string,
        senha: string
    }
}
@Response: user

## *Done* POST "/login"
@Request: {
    body: {
        email: string,
        password: string
    }
}
@Response: user

## *Done* PUT "/:userId"
@Request: {
    body: {
        name?: string,
        senha?: string
    }
}
@Response: user


## *Done* GET "/:userId/invite/:friendId/to/:eventId":
@Request{
    params: {
        userId: string, 
        eventId: string,
        friendId: string
    }
}
@Response: send notification invite to friend


## *Done* GET "/:friendId/accept_invite_from/:userId/to/:eventId":
@Request{
    params: {
        eventId: string,
        friendId: string
    }
}
@Response: event with all participants

## *Done* GET "/:friendId/recuse_invite_from/:userId/to/:eventId"

## *Done* GET "/:userId/add_friend/:friendId"
@Request: {
    params: {
        userId: string,
        friendId: string
    }
}
@Response: user with all informations


## *Done* GET "/:friendId/accept_friend_request_from/:userId":
@Request: {
    params: {
        userId: string,
        friendId: string
    }
}
@Response: user with all informations


## *Done* GET "/:friendId/recuse_friend_request_from/:userId":
@Request: {
    params: {
        userId: string,
        friendId: string
    }
}
@Response: user with all informations


## *Done* GET "/:userId/delete/:messageId":
@Request: {
    params: {
        userId: string,
        messageId: string
    }
}
@Response: user with all informations


# Routas do Evento '/event':

## *Done* GET '/'
@Request: {
    none
}
@Response: all events


## *Done* GET '/:id'
@Request: {
    params: {
        id: string
    }
}
@Response: single event


## *Done* POST '/create':
@Request: {
    body:{
        name: string,
        description: string,
        date: new Date,
        place: string,
        time: string,
        cellphone: int
        public: boolean,
        authorId: string,
        money: int,
        material: string
}


## *Done* POST "/:eventId/participate/:userId": 
@Resquest: {
    params: {
        userId: string,
        eventId: string
    },
}
@Response: event with participants included

## *Done* POST '/:eventId/sponser/:userId':
@Request{
    params: {
        userId: string, 
        eventId: string
    },
    body: {
        money?: int,
        material?: string[]
    }
}
@Response: event with all the sponser's



# Examples:
```javascript

userRoutes.post("/singup", async (request: Request, response: Response) => {

    const body = request.body

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
            id: true
        }
    })
       

    return response.status(201).json(user)
})
```