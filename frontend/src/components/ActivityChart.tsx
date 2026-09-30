import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export function ActivityChart({commits}:{commits:number}) {
  const data = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day,i)=>({
    day, value: Math.max(1, commits + [2,5,0,4,1,-1,3][i])
  }));
  return <div className="h-56 w-full">
    <ResponsiveContainer>
      <BarChart data={data}>
        <XAxis dataKey="day" tick={{fill:"#71717a",fontSize:11}} axisLine={false} tickLine={false}/>
        <Tooltip contentStyle={{background:"#18181b",border:"1px solid #27272a",borderRadius:12}}/>
        <Bar dataKey="value" radius={[5,5,2,2]} fill="#34d399"/>
      </BarChart>
    </ResponsiveContainer>
  </div>;
}
