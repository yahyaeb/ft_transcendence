// users.js

import { getAllUsersController,
        getSingleUserController,
        postSingleUserController
}   from "../controllers/usersController.js";

export async function usersRoutes(fastify, options) {
    fastify.get('/', getAllUsersController)
    fastify.get('/:id', getSingleUserController)
    fastify.post('/', async (req, reply) => {
        const body = req.body

        return { message: 'User created', user: body}
    })
}
