import { loadData } from '../../../lib/db';
import { signToken } from '../../../lib/auth';
import bcrypt from 'bcryptjs';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  const data = loadData();
  const user = data.users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const tenant = data.tenants.find(t => t.id === user.tenantId);
  const token = signToken(user, tenant);
  return res.json({ token });
}
