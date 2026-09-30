import {
  Activity, ArrowUpRight, Bot, Code2, ExternalLink, Github,
  Newspaper, RefreshCw, Search, Star, Target, Users, Zap
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ActivityChart } from "./components/ActivityChart";
import { Card } from "./components/Card";
import { GoalList } from "./components/GoalList";
import { StatCard } from "./components/StatCard";
import { getBrief, getDashboard, getNews, getTrending } from "./lib/api";

type Dashboard = {
  profile:any; repos:any[]; events:any[];
  stats:{commits:number;repositories:number;followers:number;languages:string[]}
};

const initial:Dashboard = {
  profile:{login:"Ronit049",name:"Ronit Raj"},
  repos:[],events:[],stats:{commits:0,repositories:0,followers:0,languages:[]}
};

export default function App() {
  const [username,setUsername] = useState(localStorage.getItem("devdaily-username") || "Ronit049");
  const [search,setSearch] = useState(username);
  const [data,setData] = useState<Dashboard>(initial);
  const [news,setNews] = useState<any[]>([]);
  const [trending,setTrending] = useState<any[]>([]);
  const [brief,setBrief] = useState<any>(null);
  const [loading,setLoading] = useState(true);
  const [briefLoading,setBriefLoading] = useState(false);
  const [error,setError] = useState("");

  const date = useMemo(()=>new Intl.DateTimeFormat("en-US",{
    weekday:"long",month:"long",day:"numeric",year:"numeric"
  }).format(new Date()),[]);

  async function load(name=username) {
    setLoading(true); setError("");
    try {
      const [d,n,t] = await Promise.all([getDashboard(name),getNews(),getTrending()]);
      setData(d); setNews(n); setTrending(t);
      localStorage.setItem("devdaily-username",name);
    } catch {
      setError("Could not reach the FastAPI backend. Start it on port 8000 and refresh.");
    } finally { setLoading(false); }
  }

  async function makeBrief() {
    setBriefLoading(true);
    try {
      setBrief(await getBrief({
        username:data.profile.login, solved:0, commits:data.stats.commits,
        top_languages:data.stats.languages, goals:[]
      }));
    } finally { setBriefLoading(false); }
  }

  useEffect(()=>{load()},[]);

  const hour = new Date().getHours();
  const greeting = hour<12 ? "Good morning" : hour<18 ? "Good afternoon" : "Good evening";

  return <div className="min-h-screen">
    <header className="sticky top-0 z-20 border-b border-white/5 bg-zinc-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="brand-mark"><Code2 size={20}/></div>
          <div><div className="font-bold text-white">DevDaily</div>
          <div className="hidden text-[10px] uppercase tracking-[.2em] text-zinc-600 sm:block">Developer Command Center</div></div>
        </div>
        <form onSubmit={e=>{e.preventDefault();if(search.trim()){setUsername(search.trim());load(search.trim())}}}
          className="hidden w-full max-w-sm items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-3 sm:flex">
          <Search size={16} className="text-zinc-600"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="GitHub username"
            className="w-full bg-transparent py-2.5 text-sm text-zinc-200 outline-none"/>
        </form>
        <button onClick={()=>load()} className="icon-button" title="Refresh"><RefreshCw size={17} className={loading?"animate-spin":""}/></button>
      </div>
    </header>

    <main className="mx-auto max-w-7xl space-y-6 px-5 py-8">
      {error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}

      <section className="hero panel overflow-hidden">
        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[.2em] text-emerald-400">
            <span className="status-dot"/> Live developer overview
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            {greeting}, {data.profile.name?.split(" ")[0] || data.profile.login}. 👋
          </h1>
          <p className="mt-2 text-zinc-500">{date}</p>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-400">
            Your daily snapshot of coding activity, open-source projects, developer news, and what to work on next.
          </p>
        </div>
        <div className="hero-orb"/>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="GitHub Commits" value={data.stats.commits} icon={<Activity size={17}/>}/>
        <StatCard label="Public Repositories" value={data.stats.repositories} icon={<Code2 size={17}/>}/>
        <StatCard label="Followers" value={data.stats.followers} icon={<Users size={17}/>}/>
        <StatCard label="Top Language" value={data.stats.languages[0] || "—"} icon={<Zap size={17}/>}/>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.45fr_.85fr]">
        <Card title="Coding activity" icon={<Activity size={16}/>}><ActivityChart commits={data.stats.commits}/></Card>
        <Card title="Today's goals" icon={<Target size={16}/>}><GoalList/></Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card title="AI daily brief" icon={<Bot size={16}/>}>
          {!brief ? <div className="rounded-xl bg-zinc-900/70 p-5">
            <p className="text-sm leading-6 text-zinc-400">Get a short daily plan based on your GitHub activity and stack.</p>
            <button onClick={makeBrief} disabled={briefLoading} className="primary-button mt-4">
              {briefLoading?"Generating...":"Generate today's brief"} <ArrowUpRight size={15}/>
            </button>
          </div> : <div>
            <h3 className="font-semibold text-white">{brief.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{brief.summary}</p>
            <div className="mt-4 space-y-2">{brief.recommendations.map((x:string,i:number)=>
              <div key={i} className="rounded-xl bg-zinc-900/70 p-3 text-sm text-zinc-300">
                <span className="mr-2 text-emerald-400">0{i+1}</span>{x}
              </div>)}</div>
          </div>}
        </Card>

        <Card title="Your repositories" icon={<Github size={16}/>}>
          <div className="space-y-2">{data.repos.slice(0,5).map(r=>
            <a key={r.id||r.name} href={r.html_url} target="_blank" rel="noreferrer" className="repo-row">
              <div className="min-w-0"><div className="truncate text-sm font-medium text-zinc-200">{r.name}</div>
              <div className="mt-1 truncate text-xs text-zinc-600">{r.description||"No description"}</div></div>
              <div className="flex shrink-0 items-center gap-3 text-xs text-zinc-500">
                <span>{r.language||"Code"}</span><span className="flex items-center gap-1"><Star size={12}/>{r.stargazers_count??0}</span>
              </div>
            </a>)}</div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card title="Latest developer news" icon={<Newspaper size={16}/>}>
          <div className="space-y-2">{news.map(n=>
            <a key={n.id} href={n.url||"#"} target="_blank" rel="noreferrer" className="news-row">
              <div className="min-w-0"><div className="line-clamp-2 text-sm font-medium text-zinc-300">{n.title}</div>
              <div className="mt-1 text-xs text-zinc-600">{n.score||0} points · {n.by||"community"}</div></div>
              <ExternalLink size={14} className="shrink-0 text-zinc-700"/>
            </a>)}</div>
        </Card>

        <Card title="Trending repositories" icon={<Star size={16}/>}>
          <div className="space-y-2">{trending.map(r=>
            <a key={r.id||r.full_name} href={r.html_url} target="_blank" rel="noreferrer" className="news-row">
              <div className="min-w-0"><div className="truncate text-sm font-medium text-zinc-300">{r.full_name}</div>
              <div className="mt-1 line-clamp-1 text-xs text-zinc-600">{r.description||"Open-source project"}</div></div>
              <span className="flex shrink-0 items-center gap-1 text-xs text-zinc-500"><Star size={12}/>{r.stargazers_count||0}</span>
            </a>)}</div>
        </Card>
      </section>

      <footer className="flex justify-between border-t border-white/5 py-7 text-xs text-zinc-600">
        <span>DevDaily · Built for developers who ship.</span>
        <span>Learn · Build · Ship</span>
      </footer>
    </main>
  </div>;
}
