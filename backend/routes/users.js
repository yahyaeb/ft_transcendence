// users.js

import { getAllUsersController,
        getSingleUserController,
        updateAvatar,
        getMeProfile,
        updatePassword
}   from "../controllers/usersController.js";
import { authMiddleware } from "../middleware/auth.js";


export async function usersRoutes(fastify, options) {

    fastify.get('/me', {
        preHandler: authMiddleware,
    }, getMeProfile)

    fastify.patch('/me/avatar', {
        preHandler: authMiddleware,
    }, updateAvatar)

    fastify.patch('/me/updatePassword', {
        preHandler: authMiddleware,
    }, updatePassword)

    fastify.get('/', getAllUsersController)
    fastify.get('/:id', {preHandler: authMiddleware },  getSingleUserController)

}

