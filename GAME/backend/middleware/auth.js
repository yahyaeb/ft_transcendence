import jwt from 'jsonwebtoken'
import 'dotenv/config'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables")
}

export async function authMiddleware(request, reply) {
  const token = request.cookies?.access_token;

  if (!token) {
    return reply.code(401).send({ error: 'Not authenticated' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    request.user = payload;
  } catch (error) {
    return reply.code(401).send({ error: 'Invalid or expired token' });
  }
}
