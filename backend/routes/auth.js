import { signupController, loginController } from '../controllers/authController.js';

export async function authRoutes(fastify, options){
    fastify.post('/signup', {
            schema: {
                body: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: { type: 'string', minLength: 3, maxLength: 30 },
                        password: { type: 'string', minLength: 8, maxLength: 100 },
                        avatar: { type: 'string' }
                    },
                    additionalProperties: false,
                },
                response: {
                    201: {
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                            id: { type: 'integer' },
                            username: { type: 'string' },
                            avatar: { type: 'string', nullable: true}
                        },
                    },
                },
            }   
        }, signupController
        ),
    fastify.post('/login', loginController)
}