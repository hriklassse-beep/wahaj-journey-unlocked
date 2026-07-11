import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Card {
  id: string;
  text: string;
  real: boolean; // real problem vs surface complaint
  hint: string;
}

const CARDS: Card[] = [
  { id: "1", text: "الطلاب يشتكون من ثقل المحفظة", real: false, hint: "شكوى سطحية — الأصل: غياب أدوات رقمية بديلة." },
  { id: "2", text: "الشباب لا يتفاعلون مع محتوى التراث", real: true, hint: "مشكلة جوهرية قابلة للحل بمنتج رقمي." },
  { id: "3", text: "التطبيق بطيء أحيانًا", real: false, hint: "عرض تقني — ليس مشكلة إنسانية." },
  { id: "4", text: "المزارعون يفقدون محاصيلهم بسبب التنبؤات الخاطئة", real: true, hint: "مشكلة عميقة تستحق مشروعًا." },
  { id: "5", text: "المستخدم يريد ألوانًا أكثر", real: false, hint: "تفضيل شخصي — ليس مشكلة." },
  { id: "6", text: "المرضى في القرى لا يصلون إلى استشارة نفسية", real: true, hint: "فجوة حقيقية = فرصة." },
];

export function WonderChallenge({ onDone }: { onDone: () => void }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const toggle = (id: string) => {
    if (checked) return;
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const correct = CARDS.filter((c) => c.real).map((c) => c.id).sort().join(",");
  const chosen = [...picked].sort().join(",");
  const isRight = checked && chosen === correct;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        اختر البطاقات التي تمثّل <span className="font-semibold text-primary">مشكلة حقيقية</span> يستحق أن يُبنى حولها مشروع.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {CARDS.map((c) => {
          const isPicked = picked.includes(c.id);
          const wrong = checked && isPicked && !c.real;
          const missed = checked && !isPicked && c.real;
          const right = checked && isPicked && c.real;
          return (
            <motion.button
              key={c.id}
              whileHover={{ y: -2 }}
              onClick={() => toggle(c.id)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border-2 p-4 text-right transition-all",
                !checked && isPicked && "border-primary bg-primary-soft",
                !checked && !isPicked && "border-border bg-white hover:border-primary/50",
                right && "border-[oklch(0.72_0.17_70)] bg-gold-soft",
                wrong && "border-destructive/50 bg-destructive/5",
                missed && "border-amber-400/50 bg-amber-50",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                  isPicked ? "border-primary bg-primary text-white" : "border-border",
                  right && "border-[oklch(0.72_0.17_70)] bg-[oklch(0.72_0.17_70)]",
                )}>
                  {isPicked ? "✓" : ""}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium leading-relaxed">{c.text}</div>
                  {checked && (
                    <div className={cn("mt-2 text-xs",
                      c.real ? "text-[oklch(0.4_0.14_70)]" : "text-muted-foreground")}>
                      {c.hint}
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          اخترتَ <span className="font-semibold text-foreground">{picked.length}</span> بطاقة
        </div>
        {!checked ? (
          <button
            onClick={() => setChecked(true)}
            disabled={picked.length === 0}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-node)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            تحقّق من إجابتك
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className={cn("text-sm font-semibold", isRight ? "text-[oklch(0.5_0.17_155)]" : "text-amber-600")}>
              {isRight ? "✨ ممتاز! ميّزتَ المشكلات الحقيقية." : "قريب — راجع الاختيارات ثم تابع."}
            </span>
            <button
              onClick={onDone}
              className="rounded-full bg-[color:var(--gold-deep)] px-6 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-gold)] transition-all hover:brightness-110"
            >
              متابعة →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}