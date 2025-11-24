// users.js

import { getAllUsersController,
        getSingleUserController,
        updateAvatar,
        getMeProfile
}   from "../controllers/usersController.js";
import { authMiddleware } from "../middleware/auth.js";

export async function usersRoutes(fastify, options) {

    fastify.get('/me', {
        preHandler: authMiddleware,
    }, getMeProfile)

    fastify.patch('/me/avatar', {
        preHandler: authMiddleware,
    }, updateAvatar)

    fastify.get('/', getAllUsersController)
    fastify.get('/:id', getSingleUserController)
}
