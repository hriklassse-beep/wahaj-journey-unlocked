import { motion, AnimatePresence } from "framer-motion";
import { STAGES, type StageId } from "./data";
import { cn } from "@/lib/utils";

interface Props {
  completed: StageId[];
  active: StageId;
  onSelect: (id: StageId) => void;
  allDone: boolean;
}

export function WahajNodes({ completed, active, onSelect, allDone }: Props) {
  const isDone = (id: StageId) => completed.includes(id);
  const isUnlocked = (idx: number) =>
    idx === 0 || completed.includes(STAGES[idx - 1].id) || isDone(STAGES[idx].id);

  return (
    <div className="relative mx-auto w-full max-w-6xl px-6 pt-10 pb-6" dir="ltr">
      {/* connecting line */}
      <div className="absolute inset-x-16 top-[calc(50%+8px)] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="relative flex items-start justify-between gap-2">
        {STAGES.map((s, i) => {
          const done = isDone(s.id);
          const unlocked = isUnlocked(i);
          const isActive = active === s.id;
          const prevDone = i > 0 && isDone(STAGES[i - 1].id);

          return (
            <div key={i} className="flex flex-1 flex-col items-center">
              {/* Beam segment (before this node) */}
              {i > 0 && (
                <div className="pointer-events-none absolute top-[76px] h-[3px] w-[calc(100%/5-40px)]"
                     style={{ transform: `translateX(-50%)`, left: `${(i / 5) * 100}%` }}>
                  <div className="relative h-full w-full overflow-hidden rounded-full bg-primary/10">
                    <AnimatePresence>
                      {prevDone && (
                        <motion.div
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{ duration: 1.2, ease: "easeInOut" }}
                          className="absolute inset-y-0 w-1/2 rounded-full"
                          style={{ background: "var(--gradient-gold)" }}
                        />
                      )}
                    </AnimatePresence>
                    {prevDone && (
                      <div className="absolute inset-0 rounded-full"
                           style={{ background: "linear-gradient(90deg, transparent, oklch(0.82 0.15 82 / 0.5), transparent)" }} />
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={() => unlocked && onSelect(s.id)}
                disabled={!unlocked}
                className={cn(
                  "group relative flex items-center justify-center rounded-full transition-all",
                  "size-[112px] md:size-[128px]",
                  unlocked ? "cursor-pointer" : "cursor-not-allowed opacity-40",
                )}
                aria-label={`${s.english} — ${s.arabic}`}
              >
                {/* Halo */}
                {(done || allDone) && (
                  <>
                    <span className="absolute inset-0 rounded-full"
                          style={{ boxShadow: "var(--shadow-gold)" }} />
                    <motion.span
                      className="absolute inset-0 rounded-full border-2"
                      style={{ borderColor: "oklch(0.82 0.15 82 / 0.6)" }}
                      animate={{ scale: [1, 1.35, 1.6], opacity: [0.6, 0.25, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                    />
                  </>
                )}

                {/* Circle */}
                <span
                  className={cn(
                    "relative flex size-full flex-col items-center justify-center rounded-full border-2 backdrop-blur-md transition-all",
                    done || allDone
                      ? "border-transparent"
                      : isActive
                      ? "border-primary bg-white shadow-[var(--shadow-node)]"
                      : "border-primary/50 bg-white/80",
                  )}
                  style={
                    done || allDone
                      ? {
                          background:
                            "radial-gradient(circle at 30% 30%, oklch(0.98 0.05 85), oklch(0.9 0.14 82))",
                          borderColor: "oklch(0.72 0.17 70)",
                        }
                      : undefined
                  }
                >
                  <span
                    className={cn(
                      "font-display text-4xl font-bold leading-none md:text-5xl",
                      done || allDone ? "text-[oklch(0.35_0.12_65)]" : "text-primary",
                    )}
                  >
                    {s.letter}
                  </span>
                  <span
                    className={cn(
                      "font-display mt-1 text-[10px] font-medium uppercase tracking-widest",
                      done || allDone ? "text-[oklch(0.4_0.1_65)]" : "text-primary/70",
                    )}
                  >
                    {s.english}
                  </span>
                </span>
              </button>

              <div className="mt-4 text-center">
                <div className={cn(
                  "text-sm font-semibold transition-colors",
                  done || allDone ? "text-[oklch(0.45_0.14_70)]" : isActive ? "text-primary" : "text-foreground/70"
                )}>
                  {s.arabic}
                </div>
                {isActive && (
                  <motion.div
                    layoutId="node-underline"
                    className="mx-auto mt-1 h-0.5 w-8 rounded-full bg-primary"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}