import { getMatch, getMatches, startMatch } from "../controllers/matchesController.js"

export async function startedMatch(fastify, options) {
    fastify.post('/', startMatch)
    fastify.get('/:id', getMatch)
    fastify.get('/', getMatches)
}
