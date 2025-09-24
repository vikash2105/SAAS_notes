import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

function signToken(user, tenant) {
  return jwt.sign({
    userId: user.id,
    role: user.role,
    tenantId: tenant.id,
    tenantSlug: tenant.slug
  }, JWT_SECRET, { expiresIn: '8h' });
}

function verifyToken(authHeader) {
  if (!authHeader) throw new Error('missing token');
  const parts = authHeader.split(' ');
  if (parts.length !== 2) throw new Error('invalid auth header');
  const token = parts[1];
  return jwt.verify(token, JWT_SECRET);
}

export { signToken, verifyToken };
