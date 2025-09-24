import { loadData } from '../../../lib/db';
import { signToken } from '../../../lib/auth';
import bcrypt from 'bcryptjs';

export default function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const { email, password } = req.body;
  const data = loadData();
  const user = data.users.find(u=>u.email===email);
  if(!user) return res.status(401).json({error:'invalid credentials'});
  if(!bcrypt.compareSync(password, user.password)) return res.status(401).json({error:'invalid credentials'});
  const tenant = data.tenants.find(t=>t.id===user.tenantId);
  const token = signToken(user, tenant);
  res.json({token});
}
