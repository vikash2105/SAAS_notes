import { loadData, saveData } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

export default function handler(req,res){
  try{
    const payload = verifyToken(req.headers.authorization||'');
    const data = loadData();
    const idx = data.notes.findIndex(n=>n.id===req.query.id && n.tenantId===payload.tenantId);
    if(idx===-1) return res.status(404).json({error:'not found'});
    const note = data.notes[idx];
    if(req.method==='GET'){
      return res.json(note);
    }
    if(req.method==='PUT'){
      note.title = req.body.title ?? note.title;
      note.content = req.body.content ?? note.content;
      note.updatedAt = Date.now();
      saveData(data);
      return res.json(note);
    }
    if(req.method==='DELETE'){
      data.notes.splice(idx,1);
      saveData(data);
      return res.json({ok:true});
    }
    return res.status(405).end();
  }catch(e){
    return res.status(401).json({error:e.message});
  }
}
