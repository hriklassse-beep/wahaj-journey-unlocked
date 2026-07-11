import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Domain = "heritage" | "education" | "healthcare" | "environment" | "agriculture" | "business";

interface Project {
  id: Domain;
  title: string;
  brief: string;
  need: string[]; // agent ids required
  emoji: string;
}

const PROJECTS: Project[] = [
  { id: "heritage", emoji: "🏛️", title: "تراثنا الأصيل", brief: "تطبيق قصصي يُعيد ربط الشباب بالتراث المحلي.", need: ["researcher", "writer", "ux", "dev"] },
  { id: "education", emoji: "🎓", title: "منصّة تعلّم تكيّفية", brief: "منصّة تُعدّل الدروس حسب مستوى كل طالب.", need: ["researcher", "ux", "dev", "data"] },
  { id: "healthcare", emoji: "🩺", title: "استشارة نفسية للقرى", brief: "خدمة استشارية عبر الرسائل للمناطق البعيدة.", need: ["researcher", "writer", "dev", "translator"] },
  { id: "environment", emoji: "🌿", title: "رصد جودة الهواء", brief: "لوحة بيانات مجتمعية لجودة الهواء.", need: ["data", "dev", "ux", "marketer"] },
  { id: "agriculture", emoji: "🌾", title: "مساعد المزارع الذكي", brief: "تنبؤات ريّ وأمراض للمحاصيل.", need: ["researcher", "data", "dev", "translator"] },
  { id: "business", emoji: "🚀", title: "متجر حرفيّات محلي", brief: "متجر يبرز المنتجات اليدوية للحرفيين.", need: ["writer", "designer", "dev", "marketer"] },
];

interface Agent {
  id: string;
  name: string;
  role: string;
  emoji: string;
  overlapWith?: string; // duplicate role warning
}

const AGENTS: Agent[] = [
  { id: "researcher", emoji: "🔎", name: "الباحث", role: "يجمع الرؤى والبيانات ويصوغ الفهم." },
  { id: "writer", emoji: "✍️", name: "الكاتب", role: "يكتب المحتوى السردي والتواصلي." },
  { id: "copywriter", emoji: "📝", name: "كاتب الإعلانات", role: "يكتب النصوص التسويقية القصيرة.", overlapWith: "writer" },
  { id: "ux", emoji: "🎨", name: "مصمم التجربة", role: "يصمم رحلة المستخدم والواجهات." },
  { id: "designer", emoji: "🖌️", name: "مصمم بصري", role: "يصنع الهوية البصرية والرسوم.", overlapWith: "ux" },
  { id: "dev", emoji: "💻", name: "المطوّر", role: "يبني المنتج الرقمي." },
  { id: "data", emoji: "📊", name: "محلل البيانات", role: "يحوّل الأرقام إلى قرارات." },
  { id: "marketer", emoji: "📣", name: "المسوّق", role: "يُوصل المشروع لجمهوره." },
  { id: "translator", emoji: "🌐", name: "المترجم", role: "يُكيّف المحتوى لغويًا وثقافيًا." },
  { id: "editor", emoji: "🧾", name: "المدقق اللغوي", role: "يُلمّع النصوص.", overlapWith: "writer" },
];

export function HarnessChallenge({ onDone }: { onDone: () => void }) {
  const [project, setProject] = useState<Project | null>(null);
  const [team, setTeam] = useState<string[]>([]);
  const [reviewed, setReviewed] = useState(false);

  const toggle = (id: string) => {
    if (reviewed) return;
    setTeam((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));
  };

  const analysis = useMemo(() => {
    if (!project) return null;
    const need = new Set(project.need);
    const chosen = new Set(team);
    const correctPicks = [...chosen].filter((a) => need.has(a));
    const missing = [...need].filter((a) => !chosen.has(a));
    const extras = [...chosen].filter((a) => !need.has(a));
    // duplicates: multiple chosen agents share the same base role
    const rolesSeen: Record<string, string[]> = {};
    team.forEach((id) => {
      const a = AGENTS.find((x) => x.id === id)!;
      const base = a.overlapWith ?? a.id;
      rolesSeen[base] = rolesSeen[base] || [];
      rolesSeen[base].push(id);
    });
    const duplicates = Object.values(rolesSeen).filter((arr) => arr.length > 1).flat();
    const perfect = missing.length === 0 && extras.length === 0 && duplicates.length === 0;
    return { correctPicks, missing, extras, duplicates, perfect };
  }, [project, team]);

  if (!project) {
    return (
      <div className="space-y-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-primary/70">المهمة الأولى</div>
          <h4 className="mt-1 text-lg font-bold">اختر مشروعًا لتُشكّل فريقك الذكي</h4>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <motion.button
              key={p.id}
              whileHover={{ y: -3 }}
              onClick={() => setProject(p)}
              className="group rounded-2xl border-2 border-border bg-white p-5 text-right transition-all hover:border-primary hover:shadow-[var(--shadow-node)]"
            >
              <div className="text-3xl">{p.emoji}</div>
              <div className="mt-2 text-base font-bold text-foreground">{p.title}</div>
              <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.brief}</div>
              <div className="mt-3 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                اختر هذا المشروع ←
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 rounded-2xl border border-primary/20 bg-primary-soft/60 p-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-primary/70">مشروعك</div>
          <div className="mt-1 text-lg font-bold">{project.emoji} {project.title}</div>
          <div className="mt-1 text-sm text-muted-foreground">{project.brief}</div>
        </div>
        <button onClick={() => { setProject(null); setTeam([]); setReviewed(false); }}
                className="text-xs font-medium text-primary hover:underline">تغيير المشروع</button>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-base font-bold">اختر فريقك — فقط الوكلاء الذين يخدمون هذا المشروع</h4>
          <div className="text-xs text-muted-foreground">
            الفريق: <span className="font-semibold text-foreground">{team.length}</span>
          </div>
        </div>

        <div className="grid gap-2.5 md:grid-cols-2">
          {AGENTS.map((a) => {
            const picked = team.includes(a.id);
            const isNeeded = project.need.includes(a.id);
            const isDup = reviewed && analysis?.duplicates.includes(a.id);
            const isExtra = reviewed && picked && !isNeeded && !isDup;
            const isRight = reviewed && picked && isNeeded && !isDup;
            const isMissed = reviewed && !picked && isNeeded;
            return (
              <button
                key={a.id}
                onClick={() => toggle(a.id)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border-2 p-3 text-right transition-all",
                  !reviewed && picked && "border-primary bg-primary-soft",
                  !reviewed && !picked && "border-border bg-white hover:border-primary/50",
                  isRight && "border-[oklch(0.72_0.17_70)] bg-gold-soft",
                  isDup && "border-amber-500 bg-amber-50",
                  isExtra && "border-destructive/40 bg-destructive/5",
                  isMissed && "border-dashed border-primary/60 bg-primary-soft/50",
                )}
              >
                <div className="text-2xl">{a.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{a.name}</span>
                    {isDup && <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900">دور مكرّر</span>}
                    {isExtra && <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-[10px] font-bold text-destructive">غير ضروري</span>}
                    {isMissed && <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">مطلوب</span>}
                    {isRight && <span className="rounded-full bg-[oklch(0.72_0.17_70)] px-2 py-0.5 text-[10px] font-bold text-white">اختيار ذكي</span>}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{a.role}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {reviewed && analysis && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 rounded-2xl border border-border bg-white p-5"
          >
            <div className="font-display text-xs uppercase tracking-widest text-primary/70">تحليل قرارك</div>
            {analysis.perfect ? (
              <div className="text-sm font-semibold text-[oklch(0.5_0.17_155)]">
                🎯 فريق مثالي. لم تُهدر توكنًا واحدًا، ولم تترك دورًا حرجًا.
              </div>
            ) : (
              <ul className="space-y-1.5 text-sm">
                {analysis.missing.length > 0 && (
                  <li>❗ <span className="font-medium">أدوار ناقصة:</span> {analysis.missing.map(id => AGENTS.find(a => a.id === id)?.name).join("، ")}</li>
                )}
                {analysis.extras.length > 0 && (
                  <li>💸 <span className="font-medium">وكلاء زائدون يُهدرون التوكنز:</span> {analysis.extras.map(id => AGENTS.find(a => a.id === id)?.name).join("، ")}</li>
                )}
                {analysis.duplicates.length > 0 && (
                  <li>♻️ <span className="font-medium">أدوار مكرّرة:</span> اختر واحدًا من {[...new Set(analysis.duplicates)].map(id => AGENTS.find(a => a.id === id)?.name).join("، ")}</li>
                )}
              </ul>
            )}

            <div className="rounded-xl bg-primary-soft/60 p-3 text-xs leading-relaxed text-foreground/80">
              <strong className="text-primary">استراتيجية البرومبت:</strong> لا تكتب برومبتًا عملاقًا واحدًا. قسّم مشروعك إلى مهام صغيرة، أعطِ كل وكيل مهمة واحدة واضحة، ثم أعِد استخدام مخرجاته كمُدخلات للوكيل التالي. هكذا تُوفّر التوكنز، وتُحافظ على السياق، وتصنع مكتبة برومبتات قابلة لإعادة الاستخدام.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-end gap-3">
        {!reviewed ? (
          <button
            onClick={() => setReviewed(true)}
            disabled={team.length === 0}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-node)] hover:brightness-110 disabled:opacity-40"
          >قيّم فريقي</button>
        ) : (
          <>
            <button onClick={() => { setTeam([]); setReviewed(false); }}
                    className="rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted">أعِد التشكيل</button>
            <button onClick={onDone}
                    className="rounded-full bg-[color:var(--gold-deep)] px-6 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-gold)] hover:brightness-110">متابعة →</button>
          </>
        )}
      </div>
    </div>
  );
}