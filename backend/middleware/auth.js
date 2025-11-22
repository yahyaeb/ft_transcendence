import jwt from 'jsonwebtoken'
import 'dotenv/config'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in environment variables")
}

export async function authMiddleware(request, reply) {
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.code(401).send({ error: 'missing or invalid Authorization header' });
    }

    const token = authHeader.slice(7);

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        request.user = payload;
    } catch (error) {
        return reply.code(401).send({ error: 'Invalid or expired token' });
    }
}
