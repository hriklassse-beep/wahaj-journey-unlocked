import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThreeBackground } from "./ThreeBackground";
import { WahajNodes } from "./WahajNodes";
import { STAGES, type StageId } from "./data";
import { WonderChallenge } from "./challenges/WonderChallenge";
import { AnalyseChallenge } from "./challenges/AnalyseChallenge";
import { HarnessChallenge } from "./challenges/HarnessChallenge";
import { AssemblyChallenge } from "./challenges/AssemblyChallenge";
import { JourneyChallenge } from "./challenges/JourneyChallenge";
import { cn } from "@/lib/utils";
import { StageCheckpoint } from "./StageCheckpoint";

export function WahajExperience() {
  const [completed, setCompleted] = useState<StageId[]>([]);
  const [active, setActive] = useState<StageId>("W");
  const [celebration, setCelebration] = useState(false);

  const allDone = completed.length === STAGES.length;
  const stage = useMemo(() => STAGES.find((s) => s.id === active)!, [active]);
  const stageIdx = STAGES.findIndex((s) => s.id === active);

  const complete = (id: StageId) => {
    setCompleted((c) => (c.includes(id) ? c : [...c, id]));
    // celebration ping
    setCelebration(true);
    setTimeout(() => setCelebration(false), 1400);
    const next = STAGES[STAGES.findIndex((s) => s.id === id) + 1];
    if (next) setTimeout(() => setActive(next.id), 900);
  };

  const progress = (completed.length / STAGES.length) * 100;

  return (
    <div className="relative min-h-screen text-foreground">
      <ThreeBackground />

      {/* Top bar — official ACW template row */}
      <header className="relative z-10 border-b border-border/60 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <LogoBadge label="Arab Code Week" sub="ATIE • ALECSO" />
          </div>
          <div className="hidden text-center md:block">
            <div className="font-display text-xs font-medium uppercase tracking-[0.35em] text-primary/70">
              Summer Camp · 2026
            </div>
            <div className="mt-0.5 text-sm font-semibold text-foreground">ورشة WAHAJ AI</div>
          </div>
          <div className="flex items-center gap-2">
            <BadgeChip>ATIE</BadgeChip>
            <BadgeChip>ALECSO</BadgeChip>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft/60 px-4 py-1.5 text-xs font-medium text-primary"
        >
          <span className="size-1.5 rounded-full bg-secondary" /> تجربة تعلّم تفاعلية
        </motion.div>
        <h1 className="font-display mx-auto mt-4 max-w-4xl bg-gradient-to-b from-foreground to-primary bg-clip-text text-5xl font-bold leading-tight text-transparent md:text-7xl">
          WAHAJ <span className="text-primary">AI</span>
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-foreground/70 md:text-lg">
          منهجية عملية لكشف المشكلات، وقيادة فريق من وكلاء الذكاء الاصطناعي، لبناء مشاريع رقمية تُحدث أثرًا.
        </p>
      </section>

      {/* WAHAJ nodes */}
      <WahajNodes completed={completed} active={active} onSelect={setActive} allDone={allDone} />

      {/* Progress */}
      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>تقدّمك في المنهجية</span>
          <span className="font-display text-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary/10">
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: "var(--gradient-gold)" }}
          />
        </div>
      </div>

      {/* Stage panel */}
      <main className="relative z-10 mx-auto max-w-4xl px-6 py-12">
        {!allDone ? (
          <AnimatePresence mode="wait">
            <motion.section
              key={active}
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass-panel relative overflow-hidden rounded-3xl p-8 md:p-10"
            >
              <div className="absolute -left-24 -top-24 size-64 rounded-full opacity-30 blur-3xl"
                   style={{ background: stage.color === "green" ? "var(--gradient-green)" : "var(--gradient-primary)" }} />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="font-display flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">
                    <span>مرحلة {stageIdx + 1} / {STAGES.length}</span>
                    <span>·</span>
                    <span>{stage.english}</span>
                  </div>
                  <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
                    {stage.arabic}
                  </h2>
                  <div className="mt-1 text-sm text-primary">{stage.tagline}</div>
                </div>
                <div
                  className="font-display flex size-16 items-center justify-center rounded-2xl border border-primary/20 bg-white text-3xl font-bold text-primary shadow-sm md:size-20 md:text-4xl"
                >{stage.letter}</div>
              </div>

              <div className="relative mt-6">
                <h3 className="text-xl font-bold text-foreground/90">{stage.headline}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70 md:text-base">{stage.intro}</p>
              </div>

              <div className="relative mt-8 rounded-2xl border border-border bg-white/70 p-5 md:p-6">
                <div className="font-display mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary/70">
                  <span className="size-1.5 rounded-full bg-primary" /> التحدي التفاعلي
                </div>
                {stage.id === "W" && <WonderChallenge onDone={() => complete("W")} />}
                {stage.id === "A1" && <AnalyseChallenge onDone={() => complete("A1")} />}
                {stage.id === "H" && <HarnessChallenge onDone={() => complete("H")} />}
                {stage.id === "A2" && <AssemblyChallenge onDone={() => complete("A2")} />}
                {stage.id === "J" && <JourneyChallenge onDone={() => complete("J")} />}
              </div>

              {/* Real case */}
              <div className="relative mt-6 flex items-start gap-3 rounded-2xl border border-secondary/25 bg-secondary-soft/60 p-4">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-white">
                  ✦
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-secondary">
                    الحالة الحقيقية · تراثنا الأصيل
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/80">{stage.realCase}</p>
                </div>
              </div>

              <div className="relative mt-6 flex items-center justify-between text-xs text-muted-foreground">
                <div>
                  {completed.includes(stage.id) ? (
                    <span className="font-semibold text-[oklch(0.5_0.17_155)]">✓ تم اجتياز هذه المرحلة</span>
                  ) : (
                    <span>أكمل التحدي لإضاءة نقطة {stage.letter}</span>
                  )}
                </div>
                {stageIdx < STAGES.length - 1 && (
                  <button
                    onClick={() => setActive(STAGES[stageIdx + 1].id)}
                    disabled={!completed.includes(stage.id)}
                    className="rounded-full border border-border px-4 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-40"
                  >المرحلة التالية</button>
                )}
              </div>
            </motion.section>
          </AnimatePresence>
        ) : (
          <FinalPanel />
        )}
      </main>

      {/* Celebration overlay */}
      <AnimatePresence>
        {celebration && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-x-0 top-24 z-50 flex justify-center"
          >
            <div className="rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-[oklch(0.45_0.14_70)] shadow-[var(--shadow-gold)] backdrop-blur">
              ✨ نقطة مضاءة — {stage.letter} · {stage.arabic}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="relative z-10 mx-auto max-w-6xl px-6 py-8 text-center text-xs text-muted-foreground">
        Arab Code Week · Summer Camp · WAHAJ Methodology
      </footer>
    </div>
  );
}

function LogoBadge({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[oklch(0.58_0.14_220)] text-white shadow-[var(--shadow-node)]">
        <span className="font-display text-sm font-bold">ACW</span>
        <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-white">
          ✦
        </span>
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}

function BadgeChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="hidden rounded-full border border-border bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary/70 backdrop-blur sm:inline-block">
      {children}
    </span>
  );
}

function FinalPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel relative overflow-hidden rounded-3xl p-10 text-center md:p-16"
    >
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(500px 300px at 50% 0%, oklch(0.9 0.14 82 / 0.6), transparent 70%)" }} />
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="relative text-6xl md:text-7xl"
      >🎉</motion.div>
      <h2 className="relative mt-6 text-3xl font-bold md:text-5xl">
        تهانينا! لقد أكملتَ منهجية <span className="font-display bg-gradient-to-b from-[oklch(0.6_0.17_70)] to-[oklch(0.4_0.14_65)] bg-clip-text text-transparent">WAHAJ</span>
      </h2>
      <p className="relative mx-auto mt-4 max-w-xl text-base text-foreground/70">
        الآن لديك المنهجية، والفريق، والرؤية. الخطوة القادمة: مشروعك أنت.
      </p>
      <motion.a
        href="#workspace"
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
        className="relative mt-8 inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-bold text-white shadow-[var(--shadow-gold)]"
        style={{ background: "var(--gradient-gold)" }}
      >
        🚀 <span>ابدأ مشروعك الآن</span>
      </motion.a>
      <div className="relative mt-6 text-xs uppercase tracking-widest text-primary/70">WAHAJ Workspace</div>
    </motion.div>
  );
}