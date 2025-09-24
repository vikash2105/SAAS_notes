import { loadData, saveData } from '../../../../lib/db';
import { verifyToken } from '../../../../lib/auth';
import bcrypt from 'bcryptjs';

export default function handler(req,res){
  try{
    const payload = verifyToken(req.headers.authorization||'');
    if(req.method!=='POST') return res.status(405).end();
    if(payload.tenantSlug!==req.query.slug) return res.status(403).json({error:'wrong tenant'});
    if(payload.role!=='Admin') return res.status(403).json({error:'only admins can invite'});
    const {email, role} = req.body;
    const data = loadData();
    const tenant = data.tenants.find(t=>t.slug===req.query.slug);
    if(!tenant) return res.status(404).json({error:'tenant not found'});
    if(data.users.find(u=>u.email===email)) return res.status(400).json({error:'user exists'});
    const hashed = bcrypt.hashSync('password',8);
    const user = {id:'u_'+Date.now(), email, password:hashed, role: role||'Member', tenantId: tenant.id};
    data.users.push(user);
    saveData(data);
    res.json({ok:true, user});
  }catch(e){
    res.status(401).json({error:e.message});
  }
}
