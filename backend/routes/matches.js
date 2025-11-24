import { getMatch, getMatches, startMatch, updateMatchStatus, finishedMatch } from "../controllers/matchesController.js"
import { authMiddleware } from "../middleware/auth.js"

export async function startedMatch(fastify, options) {

	fastify.addHook('preHandler', authMiddleware)
	
    fastify.post('/', startMatch)
    fastify.get('/:id', getMatch)
    fastify.get('/', getMatches)
    fastify.patch('/:id', updateMatchStatus)
    fastify.patch('/:id/finish',{
        schema: {
            body: {
                type: 'object',
                required: ['score_p1', 'score_p2', 'winner_id'],
                properties: {
                    score_p1: {type: 'integer'},
                    score_p2: {type: 'integer'},
                    winner_id: {type: 'integer'}
                },
                additionalProperties: false,
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        message: { type: 'string'},
                        id: { type: 'string'},
                        score_p1: {type: 'integer'},
                        score_p2: {type: 'integer'},
                        winner_id: {type: 'integer'}
                    }
                }
            }
        }
    }, finishedMatch)
    
}
