// users.js

import { getAllUsersController,
        getSingleUserController
}   from "../controllers/usersController.js";

export async function usersRoutes(fastify, options) {
    fastify.get('/', getAllUsersController)
    fastify.get('/:id', getSingleUserController)
}
