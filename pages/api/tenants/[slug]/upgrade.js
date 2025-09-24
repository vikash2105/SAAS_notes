import { loadData, saveData } from '../../../../lib/db';
import { verifyToken } from '../../../../lib/auth';

export default function handler(req,res){
  try{
    const payload = verifyToken(req.headers.authorization||'');
    if(req.method!=='POST') return res.status(405).end();
    const data = loadData();
    const tenant = data.tenants.find(t=>t.slug===req.query.slug);
    if(!tenant) return res.status(404).json({error:'tenant not found'});
    if(payload.tenantSlug!==req.query.slug) return res.status(403).json({error:'wrong tenant'});
    if(payload.role!=='Admin') return res.status(403).json({error:'only admins can upgrade'});
    tenant.plan = 'pro';
    saveData(data);
    res.json({ok:true, tenant});
  }catch(e){
    res.status(401).json({error:e.message});
  }
}
