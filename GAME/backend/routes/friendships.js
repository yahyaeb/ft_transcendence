import {    addFriend,
            blockUser,
            showFriends
}   from "../controllers/friendsRequests.js";
import { authMiddleware } from "../middleware/auth.js";


export async function friendsRoute(fastify, options) {

    fastify.get('/friendsList', {
        preHandler: authMiddleware,
    }, showFriends)

    fastify.post('/addFriend', {
        preHandler: authMiddleware,
    }, addFriend)

    fastify.post('/blockerUser', {
        preHandler: authMiddleware,
    }, blockUser)
}