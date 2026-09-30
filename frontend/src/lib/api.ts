const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(url: string, options?: RequestInit) {
  const r = await fetch(`${API}${url}`, options);
  if (!r.ok) throw new Error(`API error ${r.status}`);
  return r.json();
}

export const getDashboard = (username: string) =>
  request(`/api/dashboard/${encodeURIComponent(username)}`);

export const getNews = () => request("/api/news");

export const getTrending = () => request("/api/trending");

export const getBrief = (payload: {
  username: string; solved: number; commits: number;
  top_languages: string[]; goals: string[];
}) => request("/api/ai/brief", {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify(payload)
});
