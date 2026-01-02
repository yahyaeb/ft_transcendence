// users.js

import { getAllUsersController,
        getSingleUserController,
        updateAvatar,
        getMeProfile,
        updatePassword,
        updateUsername,
        getUserStats,
        getHistory,
        ping,
        getUserTicStats,
        getTicHistory
}   from "../controllers/usersController.js";
import { authMiddleware } from "../middleware/auth.js";


export async function usersRoutes(fastify, options) {

    fastify.patch("/me/ping", {
            preHandler: authMiddleware,
    }, ping);
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

    fastify.get('/',  {
        preHandler: authMiddleware,
    }, getAllUsersController)

    fastify.get('/:id', {
        preHandler: authMiddleware,
    },  getSingleUserController)
    fastify.get('/me/stats',
        { preHandler: authMiddleware },
        getUserStats)
    fastify.get('/me/history',
        { preHandler: authMiddleware },
        getHistory)
    fastify.get('/me/ticstats',
        { preHandler: authMiddleware },
        getUserTicStats)
    fastify.get('/me/tichistory',
        { preHandler: authMiddleware },
        getTicHistory)
}

