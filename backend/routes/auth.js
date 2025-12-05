import { signupController, loginController, verifyTwoFactorSetup, enableTwoFactor } from '../controllers/authController.js';
import { authMiddleware } from "../middleware/auth.js";

export async function authRoutes(fastify, options) {
  fastify.post(
    '/signup',
    {
      schema: {
        body: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: { type: 'string', minLength: 3, maxLength: 30 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8, maxLength: 100 },
            avatar: { type: 'string' }
          },
          additionalProperties: false
        },
        response: {
          201: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              id: { type: 'integer' },
              username: { type: 'string' },
              email: { type: 'string' },
              avatar: { type: 'string', nullable: true }
            }
          }
        }
      }
    },
    signupController
  )

  fastify.post('/login', loginController)
  fastify.post('/2fa/enable', { preHandler: [authMiddleware] }, enableTwoFactor)
  fastify.post('/2fa/verify-setup', { preHandler: [authMiddleware] }, verifyTwoFactorSetup)
}
