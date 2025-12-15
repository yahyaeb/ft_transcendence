// users.js

import { getAllUsersController,
        getSingleUserController,
        updateAvatar,
        getMeProfile,
        updatePassword,
        updateUsername,
        getUserStats,
        getHistory
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

        fastify.patch('/me/updateUsername', {
        preHandler: authMiddleware,
    }, updateUsername)

    fastify.get('/', getAllUsersController)
    fastify.get('/:id', {
        preHandler: authMiddleware,
    },  getSingleUserController)
    fastify.get('/me/stats',
        { preHandler: authMiddleware },
        getUserStats)
    fastify.get('/me/history',
        { preHandler: authMiddleware },
        getHistory)

}

