import { ReactNode } from "react";

export function Card({title, icon, children, className=""}: {
  title: string; icon?: ReactNode; children: ReactNode; className?: string
}) {
  return <section className={`panel ${className}`}>
    <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-zinc-200">
      {icon}{title}
    </div>
    {children}
  </section>;
}
