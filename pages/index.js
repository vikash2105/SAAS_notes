import { useState, useEffect } from 'react';

export default function Home() {
  const [token, setToken] = useState(null);
  const [notes, setNotes] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [payload, setPayload] = useState(null);

  async function login() {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) { setMsg(data.error); return; }
    setToken(data.token);
    localStorage.setItem('token', data.token);
    decodeToken(data.token);
    loadNotes(data.token);
  }

  function decodeToken(t) {
    const p = JSON.parse(atob(t.split('.')[1]));
    setPayload(p);
  }

  async function loadNotes(tok = token) {
    if (!tok) return;
    const res = await fetch('/api/notes', { headers: { authorization: 'Bearer ' + tok } });
    const data = await res.json();
    if (res.ok) setNotes(data);
  }

  async function createNote() {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer ' + token },
      body: JSON.stringify({ title, content })
    });
    const data = await res.json();
    if (res.ok) loadNotes();
    else alert(data.error);
  }

  async function deleteNote(id) {
    const res = await fetch('/api/notes/' + id, {
      method: 'DELETE',
      headers: { authorization: 'Bearer ' + token }
    });
    if (res.ok) loadNotes();
    else { const d = await res.json(); alert(d.error); }
  }

  async function upgrade() {
    const res = await fetch('/api/tenants/' + payload.tenantSlug + '/upgrade', {
      method: 'POST',
      headers: { authorization: 'Bearer ' + token }
    });
    if (res.ok) { alert('Upgraded'); loadNotes(); } else { alert('Upgrade failed'); }
  }

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) { setToken(t); decodeToken(t); loadNotes(t); }
  }, []);

  if (!token) return (
    <div>
      <h1>Login</h1>
      <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} /><br />
      <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={login}>Login</button>
      <div>{msg}</div>
    </div>
  );

  return (
    <div>
      <div>Logged in as {payload?.userId} ({payload?.role}) - Tenant: {payload?.tenantSlug}</div>
      <button onClick={() => { setToken(null); localStorage.removeItem('token'); }}>Logout</button>
      <h2>Notes</h2>
      <ul>
        {notes.map(n => (
          <li key={n.id}><b>{n.title}</b> - {n.content} <button onClick={() => deleteNote(n.id)}>Delete</button></li>
        ))}
      </ul>
      <h3>Create Note</h3>
      <input placeholder="title" value={title} onChange={e => setTitle(e.target.value)} /><br />
      <textarea placeholder="content" value={content} onChange={e => setContent(e.target.value)} /><br />
      <button onClick={createNote}>Create</button>
      {notes.length >= 3 && <div><button onClick={upgrade}>Upgrade to Pro</button></div>}
    </div>
  );
}
