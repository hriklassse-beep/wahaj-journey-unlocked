import { useState } from "react";
import { Reorder } from "framer-motion";
import { cn } from "@/lib/utils";

interface Step { id: string; text: string; order: number; }

const STEPS: Step[] = [
  { id: "a", text: "افهم جمهورك — من هم فعلاً؟", order: 1 },
  { id: "b", text: "ارصد سلوكهم الحالي مع الحلول القائمة", order: 2 },
  { id: "c", text: "حدّد الفجوة التي لا يعالجها أحد", order: 3 },
  { id: "d", text: "صُغ فرضية حل قابلة للاختبار", order: 4 },
];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

export function AnalyseChallenge({ onDone }: { onDone: () => void }) {
  const [items, setItems] = useState<Step[]>(() => shuffle(STEPS));
  const [checked, setChecked] = useState(false);
  const correct = items.every((s, i) => s.order === i + 1);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        رتّب خطوات التحليل من <span className="font-semibold text-primary">الأعمق</span> إلى <span className="font-semibold text-primary">الأقرب للتنفيذ</span>. اسحب البطاقات.
      </p>

      <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-2">
        {items.map((s, i) => (
          <Reorder.Item
            key={s.id}
            value={s}
            className={cn(
              "flex cursor-grab items-center gap-3 rounded-2xl border-2 bg-white p-4 shadow-sm active:cursor-grabbing",
              checked && s.order === i + 1 && "border-[oklch(0.72_0.17_70)] bg-gold-soft",
              checked && s.order !== i + 1 && "border-amber-300 bg-amber-50",
              !checked && "border-border hover:border-primary/40",
            )}
          >
            <span className="font-display flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {i + 1}
            </span>
            <span className="flex-1 text-sm font-medium">{s.text}</span>
            <span className="text-lg text-muted-foreground/50">≡</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">💡 الترتيب الصحيح يفتح الفرصة قبل أن تُبنى الحلول.</div>
        {!checked ? (
          <button
            onClick={() => setChecked(true)}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-node)] hover:brightness-110"
          >تحقّق</button>
        ) : (
          <div className="flex items-center gap-3">
            <span className={cn("text-sm font-semibold", correct ? "text-[oklch(0.5_0.17_155)]" : "text-amber-600")}>
              {correct ? "🎯 ترتيب دقيق." : "أعد الترتيب — فكّر: ماذا نعرف قبل ما نقرّر؟"}
            </span>
            {correct ? (
              <button onClick={onDone} className="rounded-full bg-[color:var(--gold-deep)] px-6 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-gold)] hover:brightness-110">متابعة →</button>
            ) : (
              <button onClick={() => setChecked(false)} className="rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted">حاول مرة أخرى</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}