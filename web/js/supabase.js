/* ============================================================
   SUPABASE CONFIG — Cabaña La Gabriela
   ============================================================ */
const SUPABASE_URL = 'https://ajfsocuokneynzozyddu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_eGhEcL8ZapYUySLzrmsyng_vPxNCNyD';

/* ---- Sesión ---- */
function sbGetSession() {
  try {
    const token  = localStorage.getItem('sb_access_token');
    const expiry = parseInt(localStorage.getItem('sb_token_expiry') || '0');
    if (token && Date.now() < expiry) return token;
    return null;
  } catch { return null; }
}

function sbSaveSession(data) {
  localStorage.setItem('sb_access_token', data.access_token);
  localStorage.setItem('sb_token_expiry', String(Date.now() + data.expires_in * 1000));
  if (data.refresh_token) localStorage.setItem('sb_refresh_token', data.refresh_token);
}

function sbClearSession() {
  localStorage.removeItem('sb_access_token');
  localStorage.removeItem('sb_token_expiry');
  localStorage.removeItem('sb_refresh_token');
}

/* ---- Headers ---- */
function sbHeaders(extra = {}) {
  const token = sbGetSession();
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + (token || SUPABASE_KEY),
    'Content-Type': 'application/json',
    ...extra
  };
}

/* ---- Auth ---- */
async function sbSignIn(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error_description || err.message || 'Credenciales incorrectas');
  }
  const data = await res.json();
  sbSaveSession(data);
  return data;
}

async function sbSignOut() {
  const token = sbGetSession();
  if (token) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + token }
    }).catch(() => {});
  }
  sbClearSession();
}

/* ---- CRUD ---- */
async function sbInsert(table, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: sbHeaders({ 'Prefer': 'return=representation' }),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  return Array.isArray(json) ? json[0] : json;
}

async function sbSelect(table, query = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query ? '?' + query : ''}`, {
    headers: sbHeaders()
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function sbUpdate(table, id, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: sbHeaders({ 'Prefer': 'return=representation' }),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function sbDelete(table, id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'DELETE',
    headers: sbHeaders()
  });
  if (!res.ok) throw new Error(await res.text());
}
