import { ReactNode } from "react";

export function StatCard({label, value, icon}: {
  label: string; value: string | number; icon: ReactNode
}) {
  return <div className="panel">
    <div className="mb-3 flex items-center justify-between">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-zinc-400">{icon}</span>
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
  </div>;
}
