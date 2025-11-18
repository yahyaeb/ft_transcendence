// users.js

import { getAllUsersController,
        getSingleUserController,
        postSingleUserController
}   from "../controllers/usersController.js";

export async function usersRoutes(fastify, options) {
    fastify.get('/', getAllUsersController)
    fastify.get('/:id', getSingleUserController)
    fastify.post('/', {
        schema: {
            body: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                    username: { type: 'string', minLength: 3, maxLength: 30 },
                    password: { type: 'string', minLength: 8, maxLength: 100 },
                },
                additionalProperties: false,
            },
            response: {
                201: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        id: { type: 'integer' },
                        username: { type: 'string' },
                    },
                },
            },
        }   
    }, postSingleUserController
    )
}
