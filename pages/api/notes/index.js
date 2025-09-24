import { loadData, saveData } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';
import { nanoid } from 'nanoid';

export default function handler(req,res){
  try{
    const payload = verifyToken(req.headers.authorization||'');
    const data = loadData();
    const tenant = data.tenants.find(t=>t.id===payload.tenantId);
    if(!tenant) return res.status(400).json({error:'tenant not found'});
    if(req.method==='GET'){
      const notes = data.notes.filter(n=>n.tenantId===tenant.id);
      return res.json(notes);
    }
    if(req.method==='POST'){
      const notes = data.notes.filter(n=>n.tenantId===tenant.id);
      if(tenant.plan==='free' && notes.length>=3) return res.status(403).json({error:'note limit reached - upgrade to pro'});
      const note = {id:nanoid(), tenantId:tenant.id, title:req.body.title||'', content:req.body.content||'', createdBy:payload.userId, updatedAt:Date.now()};
      data.notes.push(note);
      saveData(data);
      return res.status(201).json(note);
    }
    return res.status(405).end();
  }catch(e){
    return res.status(401).json({error:e.message});
  }
}
