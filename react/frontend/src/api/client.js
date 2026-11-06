const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
  .replace(/\/+$/, "");

export async function apiRequest(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(`Could not connect to the API at ${API_BASE_URL}. Check that the backend is running.`);
  }

  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      throw new Error(`The API returned an invalid response (HTTP ${response.status}).`);
    }
  }

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}.`);
  }

  return payload;
}

export const getProjects = () => apiRequest("/projects");
export const getProject = (id) => apiRequest(`/projects/${encodeURIComponent(id)}`);

export function createProject(project, token) {
  return apiRequest("/projects", {
    method: "POST",
    token,
    body: JSON.stringify(project),
  });
}

export function updateProject(id, project, token) {
  return apiRequest(`/projects/${encodeURIComponent(id)}`, {
    method: "PUT",
    token,
    body: JSON.stringify(project),
  });
}

export function deleteProject(id, token) {
  return apiRequest(`/projects/${encodeURIComponent(id)}`, {
    method: "DELETE",
    token,
  });
}
