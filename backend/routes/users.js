// users.js

import { getAllUsersController,
        getSingleUserController,
        updateAvatar
}   from "../controllers/usersController.js";

export async function usersRoutes(fastify, options) {
    fastify.get('/', getAllUsersController)
    fastify.get('/:id', getSingleUserController)
    fastify.patch('/:id/avatar', updateAvatar)
}
