import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type Goal = {id:string; text:string; completed:boolean};
const defaults: Goal[] = [
  {id:"1", text:"Solve 3 DSA problems", completed:false},
  {id:"2", text:"Make one GitHub contribution", completed:false},
  {id:"3", text:"Read one technical article", completed:false}
];

export function GoalList() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem("devdaily-goals");
    return saved ? JSON.parse(saved) : defaults;
  });
  const [text, setText] = useState("");

  const persist = (next: Goal[]) => {
    setGoals(next);
    localStorage.setItem("devdaily-goals", JSON.stringify(next));
  };

  const add = () => {
    if (!text.trim()) return;
    persist([...goals, {id: crypto.randomUUID(), text:text.trim(), completed:false}]);
    setText("");
  };

  return <div>
    <div className="space-y-2">
      {goals.map(g => <div key={g.id} className="group flex items-center gap-3 rounded-xl bg-zinc-900/70 px-3 py-3">
        <input type="checkbox" checked={g.completed}
          onChange={() => persist(goals.map(x => x.id===g.id ? {...x, completed:!x.completed}:x))}
          className="h-4 w-4 accent-emerald-400" />
        <span className={`flex-1 text-sm ${g.completed ? "text-zinc-600 line-through":"text-zinc-300"}`}>{g.text}</span>
        <button onClick={() => persist(goals.filter(x=>x.id!==g.id))}
          className="text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-red-400"><Trash2 size={15}/></button>
      </div>)}
    </div>
    <div className="mt-4 flex gap-2">
      <input className="input" value={text} onChange={e=>setText(e.target.value)}
        onKeyDown={e=>e.key==="Enter" && add()} placeholder="Add a goal..." />
      <button onClick={add} className="icon-button"><Plus size={18}/></button>
    </div>
  </div>;
}
