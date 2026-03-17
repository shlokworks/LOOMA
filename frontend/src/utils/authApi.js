const API = import.meta.env.VITE_API_URL || 'http://localhost:5050';

function authHeaders(token) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

/* ─── Auth ─────────────────────────────────────────────────────────── */

export async function apiRegister(name, email, password) {
  const res = await fetch(`${API}/auth/looma/register`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data; // { token, user }
}

export async function apiLogin(email, password) {
  const res = await fetch(`${API}/auth/looma/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data; // { token, user }
}

export async function apiGetMe(token) {
  const res = await fetch(`${API}/auth/looma/me`, {
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch user');
  return data; // { user }
}

/* ─── Projects ─────────────────────────────────────────────────────── */

export async function apiGetProjects(token) {
  const res = await fetch(`${API}/api/projects`, {
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch projects');
  return data; // { owned, shared }
}

export async function apiGetProject(token, projectId) {
  const res = await fetch(`${API}/api/projects/${projectId}`, {
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load project');
  return data; // { project, files }
}

export async function apiDeleteProject(token, projectId) {
  const res = await fetch(`${API}/api/projects/${projectId}`, {
    method:  'DELETE',
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete project');
  return data;
}

export async function apiRenameProject(token, projectId, name) {
  const res = await fetch(`${API}/api/projects/${projectId}`, {
    method:  'PUT',
    headers: authHeaders(token),
    body:    JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to rename project');
  return data;
}

/* ─── Collaborators ─────────────────────────────────────────────────── */

export async function apiGetCollaborators(token, projectId) {
  const res = await fetch(`${API}/api/projects/${projectId}/collaborators`, {
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch collaborators');
  return data; // { collaborators }
}

export async function apiInviteCollaborator(token, projectId, email, role = 'editor') {
  const res = await fetch(`${API}/api/projects/${projectId}/invite`, {
    method:  'POST',
    headers: authHeaders(token),
    body:    JSON.stringify({ email, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send invite');
  return data;
}

export async function apiRemoveCollaborator(token, projectId, collabId) {
  const res = await fetch(`${API}/api/projects/${projectId}/collaborators/${collabId}`, {
    method:  'DELETE',
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to remove collaborator');
  return data;
}

export async function apiAcceptInvite(token, inviteToken) {
  const res = await fetch(`${API}/auth/looma/accept-invite/${inviteToken}`, {
    method:  'POST',
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to accept invite');
  return data; // { success, project }
}

export async function apiGetInviteInfo(inviteToken) {
  const res = await fetch(`${API}/auth/looma/invite-info/${inviteToken}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Invite not found');
  return data; // { email, projectName, inviterName }
}
