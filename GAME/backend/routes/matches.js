import { 
  getMatch, 
  getMatches, 
  startMatch, 
  updateMatchStatus, 
  finishedMatch,
  startMatchTicTac,
  finishMatchTicTac 
} from "../controllers/matchesController.js"

import { authMiddleware } from "../middleware/auth.js"

export async function matchesRoutes(fastify, options) {
    fastify.addHook('preHandler', authMiddleware)

    fastify.post('/', startMatch)
    fastify.get('/', getMatches)
    fastify.get('/:id', getMatch)

    fastify.patch('/:id', updateMatchStatus)

    fastify.patch('/:id/finish', {
        schema: {
            body: {
                type: 'object',
                required: ['score_p1', 'score_p2'],
                properties: {
                    score_p1: { type: 'integer' },
                    score_p2: { type: 'integer' },
                },
                additionalProperties: false,
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        message: { type: 'string'},
                        id: { type: 'number'},
                        score_p1: { type: 'integer'},
                        score_p2: { type: 'integer'},
                        winner_id: { type: 'integer'}
                    }
                }
            }
        }
    }, finishedMatch)
    fastify.post('/starttic', startMatchTicTac)
    fastify.patch("/:id/finishtic", {
        schema: {
            body: {
            type: "object",
            required: ["result"],
            properties: {
                result: { type: "string"},
            },
            additionalProperties: false,
            },
            response: {
            200: {
                type: "object",
                properties: {
                message: { type: "string" },
                winner_id: { anyOf: [{ type: "integer" }, { type: "null" }] },
                },
            },
            },
        },
    }, finishMatchTicTac);

}

