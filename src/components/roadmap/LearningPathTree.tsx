import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronRight, GraduationCap, Users, Wrench } from "lucide-react";
import type { LearningPathItem } from "@/lib/roadmap/types";

const TYPE_ICON = {
  course: GraduationCap,
  book: BookOpen,
  lab: Wrench,
  community: Users,
} as const;

function PathNode({ item, depth = 0 }: { item: LearningPathItem; depth?: number }) {
  const [open, setOpen] = useState(depth === 0);
  const Icon = TYPE_ICON[item.type];
  const hasChildren = item.children && item.children.length > 0;

  return (
    <li className={depth > 0 ? "ml-4 border-l border-border/40 pl-4" : ""}>
      <button
        type="button"
        onClick={() => hasChildren && setOpen(!open)}
        className={`flex w-full items-center gap-2 rounded-lg py-2 text-left ${hasChildren ? "hover:bg-card/40" : ""}`}
      >
        {hasChildren ? (
          <ChevronRight
            className={`size-4 shrink-0 text-muted-foreground transition ${open ? "rotate-90" : ""}`}
          />
        ) : (
          <span className="size-4" />
        )}
        <Icon className="size-4 shrink-0 text-neon-purple" />
        <span className="flex-1 text-sm font-medium">{item.title}</span>
        <span className="text-[10px] text-muted-foreground">{item.duration}</span>
      </button>
      <AnimatePresence>
        {open && hasChildren ? (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-1 overflow-hidden"
          >
            {item.children!.map((child) => (
              <PathNode key={child.id} item={child} depth={depth + 1} />
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </li>
  );
}

export function LearningPathTree({ items }: { items: LearningPathItem[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass rounded-2xl p-6"
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Expandable learning path
      </p>
      <ul className="mt-4 space-y-1">
        {items.map((item) => (
          <PathNode key={item.id} item={item} />
        ))}
      </ul>
    </motion.div>
  );
}
