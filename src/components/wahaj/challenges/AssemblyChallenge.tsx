import { useState } from "react";
import { Reorder } from "framer-motion";
import { cn } from "@/lib/utils";

interface Node { id: string; label: string; emoji: string; order: number; }

const NODES: Node[] = [
  { id: "r", emoji: "🔎", label: "بحث", order: 1 },
  { id: "c", emoji: "✍️", label: "محتوى", order: 2 },
  { id: "d", emoji: "🎨", label: "تصميم", order: 3 },
  { id: "b", emoji: "💻", label: "تطوير", order: 4 },
  { id: "t", emoji: "🧪", label: "اختبار", order: 5 },
];
function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

export function AssemblyChallenge({ onDone }: { onDone: () => void }) {
  const [nodes, setNodes] = useState<Node[]>(() => shuffle(NODES));
  const [checked, setChecked] = useState(false);
  const correct = nodes.every((n, i) => n.order === i + 1);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        اسحب المحطّات لتُنشئ سير عمل يُغذّي بعضه بعضًا — كل خطوة تسلّم مخرجاتها للتي تليها.
      </p>

      <Reorder.Group axis="x" values={nodes} onReorder={setNodes} className="flex flex-wrap items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-primary/25 bg-primary-soft/30 p-6">
        {nodes.map((n, i) => (
          <div key={n.id} className="flex items-center">
            <Reorder.Item
              value={n}
              className={cn(
                "flex cursor-grab flex-col items-center gap-1 rounded-2xl border-2 bg-white px-5 py-3 shadow-sm active:cursor-grabbing",
                checked && n.order === i + 1 ? "border-[oklch(0.72_0.17_70)] bg-gold-soft" :
                checked ? "border-amber-300 bg-amber-50" : "border-border hover:border-primary/40"
              )}
            >
              <span className="text-2xl">{n.emoji}</span>
              <span className="text-xs font-semibold">{n.label}</span>
            </Reorder.Item>
            {i < nodes.length - 1 && <span className="mx-1 text-primary/40">→</span>}
          </div>
        ))}
      </Reorder.Group>

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">💡 مخرجات كل وكيل تصبح مُدخل الوكيل التالي.</div>
        {!checked ? (
          <button onClick={() => setChecked(true)}
                  className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-node)] hover:brightness-110">تحقّق</button>
        ) : (
          <div className="flex items-center gap-3">
            <span className={cn("text-sm font-semibold", correct ? "text-[oklch(0.5_0.17_155)]" : "text-amber-600")}>
              {correct ? "🧩 سير عمل متماسك." : "أعد الترتيب — لا يمكنك التصميم قبل البحث."}
            </span>
            {correct ? (
              <button onClick={onDone}
                      className="rounded-full bg-[color:var(--gold-deep)] px-6 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-gold)] hover:brightness-110">متابعة →</button>
            ) : (
              <button onClick={() => setChecked(false)}
                      className="rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted">حاول مرة أخرى</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}