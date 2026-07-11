import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Milestone { id: string; label: string; smart: boolean; hint: string; }
const M: Milestone[] = [
  { id: "1", label: "أطلق لجمهور صغير أولاً وارصد سلوكهم", smart: true, hint: "بداية آمنة تُعطيك بيانات حقيقية." },
  { id: "2", label: "أطلق حملة إعلانية ضخمة قبل التحقق", smart: false, hint: "احرق الميزانية قبل إثبات القيمة." },
  { id: "3", label: "اجمع ملاحظات ثم كرّر أسبوعيًا", smart: true, hint: "التكرار القصير = تحسين مستمر." },
  { id: "4", label: "أضف كل الميزات التي طلبها المستخدمون فورًا", smart: false, hint: "التخمة تُشتّت المنتج." },
  { id: "5", label: "قِس أثرك بمؤشر واحد واضح", smart: true, hint: "قياس واحد أقوى من عشرة." },
  { id: "6", label: "توسّع بعد إثبات القيمة، لا قبلها", smart: true, hint: "لا تُقاس النجاحات بالحجم بل بالأثر." },
];

export function JourneyChallenge({ onDone }: { onDone: () => void }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const correctIds = M.filter(m => m.smart).map(m => m.id).sort().join(",");
  const chosen = [...picked].sort().join(",");
  const isRight = checked && chosen === correctIds;

  const toggle = (id: string) => { if (!checked) setPicked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        اختر محطّات الإطلاق <span className="font-semibold text-primary">الذكية</span> لمشروعك.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {M.map(m => {
          const p = picked.includes(m.id);
          const wrong = checked && p && !m.smart;
          const missed = checked && !p && m.smart;
          const right = checked && p && m.smart;
          return (
            <motion.button key={m.id} whileHover={{ y: -2 }} onClick={() => toggle(m.id)}
              className={cn(
                "flex items-start gap-3 rounded-2xl border-2 p-4 text-right transition-all",
                !checked && p && "border-primary bg-primary-soft",
                !checked && !p && "border-border bg-white hover:border-primary/50",
                right && "border-[oklch(0.72_0.17_70)] bg-gold-soft",
                wrong && "border-destructive/40 bg-destructive/5",
                missed && "border-amber-400/50 bg-amber-50",
              )}>
              <div className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
                p ? "border-primary bg-primary text-white" : "border-border")}>{p ? "✓" : ""}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{m.label}</div>
                {checked && <div className="mt-1.5 text-xs text-muted-foreground">{m.hint}</div>}
              </div>
            </motion.button>
          );
        })}
      </div>
      <div className="flex items-center justify-end gap-3">
        {!checked ? (
          <button onClick={() => setChecked(true)} disabled={picked.length === 0}
                  className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-node)] hover:brightness-110 disabled:opacity-40">تحقّق</button>
        ) : (
          <>
            <span className={cn("text-sm font-semibold", isRight ? "text-[oklch(0.5_0.17_155)]" : "text-amber-600")}>
              {isRight ? "🚀 عقلية إطلاق ناضجة." : "راجع خياراتك — الإطلاق ليس صخبًا."}
            </span>
            <button onClick={onDone}
                    className="rounded-full bg-[color:var(--gold-deep)] px-6 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-gold)] hover:brightness-110">إكمال المنهجية →</button>
          </>
        )}
      </div>
    </div>
  );
}