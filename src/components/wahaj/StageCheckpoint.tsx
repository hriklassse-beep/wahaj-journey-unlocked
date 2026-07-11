import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { StageId } from "./data";

interface CheckpointQuestion {
  concept: string;
  question: string;
  options: { label: string; correct?: boolean; why: string }[];
}

const CHECKPOINTS: Record<StageId, CheckpointQuestion> = {
  W: {
    concept: "التمييز بين الشكوى السطحية والمشكلة الجوهرية",
    question:
      "في مشروع «عالمي العربي / تراثنا الأصيل»، ما المشكلة الجوهرية التي انطلق منها الفريق؟",
    options: [
      {
        label: "الأطفال لا يعرفون أسماء الدول العربية على الخريطة",
        why: "هذه شكوى سطحية — نتيجة، لا سبب. الفريق نظر أعمق من ذلك.",
      },
      {
        label: "غياب ارتباط عاطفي وحسّي للأطفال بهويّتهم وتراثهم العربي",
        correct: true,
        why: "هذا هو الجذر: المعرفة موجودة، لكن التجربة الحسّية والانتماء غائبان — ومن هنا وُلد المشروع.",
      },
      {
        label: "لا توجد تطبيقات تعليمية عربية على الإطلاق",
        why: "غير صحيح — التطبيقات موجودة، لكنها لا تُخاطب الفئة العمرية بلغة حسّية تفاعلية.",
      },
    ],
  },
  A1: {
    concept: "تحويل الغموض إلى وضوح عبر تحليل الجمهور والسلوك",
    question:
      "ما الاكتشاف الأهم الذي كشفه التحليل قبل بناء «عالمي العربي»؟",
    options: [
      {
        label: "طفل الحضانة وطفل المتوسط يحتاجان محتوى وتصميمًا مختلفَين تمامًا",
        correct: true,
        why: "لذلك انقسم المشروع إلى ثلاث فئات (حضانة · ابتدائي · متوسط) بمحتوى وصعوبة مختلفة لكل واحدة.",
      },
      {
        label: "تصميم واحد يصلح لكل الأعمار لتوفير الوقت",
        why: "هذا هو الخطأ الذي تجنّبه التحليل — التصميم الموحّد يُفقد التجربة أثرها الحسّي.",
      },
      {
        label: "يكفي إضافة المزيد من الدول لجذب الأطفال",
        why: "الكمّ لا يحلّ مشكلة الانتماء — التحليل كشف أن المشكلة نوعية لا كمّية.",
      },
    ],
  },
  H: {
    concept: "اختيار فريق ذكاء اصطناعي دون هدر أو تكرار",
    question:
      "أيّ فريق وكلاء يخدم «عالمي العربي» دون هدر توكنز؟",
    options: [
      {
        label: "مطوّر فقط — البقيّة رفاهية",
        why: "ناقص: لا محتوى تربوي، لا تصميم بصري، لا بحث. المطوّر وحده يبني قوقعة فارغة.",
      },
      {
        label: "باحث تراثي + كاتب محتوى تربوي + مصمم تجربة + مطوّر",
        correct: true,
        why: "أربعة أدوار متكاملة، بلا تكرار، وكل واحد يخدم حاجة حقيقية في المشروع.",
      },
      {
        label: "١٠ وكلاء يشملون مسوّقًا وكاتب إعلانات ومحلل SEO",
        why: "هدر واضح — التسويق و SEO ليسا أولوية في مرحلة البناء الأولى للمشروع التعليمي.",
      },
    ],
  },
  A2: {
    concept: "ربط مخرجات الوكلاء في تسلسل متماسك",
    question:
      "كيف جُمعت مكوّنات «عالمي العربي» (الخريطة · المطابقة · الألعاب · لوحة التقدّم) في منتج واحد؟",
    options: [
      {
        label: "بُنيت كتطبيقات منفصلة يفتحها الطفل واحدًا تلو الآخر",
        why: "هذا تفكيك لا تجميع — يفقد الطفل الإحساس بالرحلة الواحدة.",
      },
      {
        label: "بحث الفئات العمرية → محتوى مُصنّف → تصميم بصري موحّد → ألعاب تفاعلية داخل تجربة واحدة",
        correct: true,
        why: "تسلسل واضح: كل خطوة تُغذّي التي بعدها، والنتيجة تطبيق واحد يشعر الطفل فيه بالانتقال السلس.",
      },
      {
        label: "لصق كل المخرجات في صفحة واحدة طويلة",
        why: "اللصق ليس تجميعًا — التجميع يعني تسلسلًا سرديًا وتصميميًا مترابطًا.",
      },
    ],
  },
  J: {
    concept: "الإطلاق التدريجي المبني على الملاحظات",
    question:
      "ما الخطوة الأذكى لإطلاق «عالمي العربي» بعد اكتمال النسخة الأولى؟",
    options: [
      {
        label: "إطلاقه فورًا في كل الدول العربية بحملة إعلانية كبيرة",
        why: "حرق للمراحل — بلا ملاحظات حقيقية، أي خطأ يتضخّم على آلاف الأطفال.",
      },
      {
        label: "تجربته مع فئة عمرية واحدة في مدرسة واحدة، جمع ملاحظات، ثم التوسّع",
        correct: true,
        why: "هذه هي منهجية Journey: محطات صغيرة، ملاحظات حقيقية، تحسين، ثم توسّع مدروس.",
      },
      {
        label: "تأجيل الإطلاق حتى يكون التطبيق مثاليًا ١٠٠٪",
        why: "الكمال المؤجَّل = عدم إطلاق. الإطلاق المبكّر مع فئة صغيرة يكشف ما لا يكشفه أي تخطيط.",
      },
    ],
  },
};

export function StageCheckpoint({
  stageId,
  onPass,
  onRetryChallenge,
}: {
  stageId: StageId;
  onPass: () => void;
  onRetryChallenge: () => void;
}) {
  const cp = CHECKPOINTS[stageId];
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const isCorrect = picked !== null && cp.options[picked].correct === true;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary-soft/60 px-4 py-1.5 text-xs font-semibold text-secondary w-fit">
        <span className="size-1.5 rounded-full bg-secondary" />
        نقطة تحقّق · تأكيد المفهوم
      </div>

      <div>
        <div className="font-display text-xs uppercase tracking-widest text-primary/70">
          المفهوم
        </div>
        <div className="mt-1 text-sm font-semibold text-foreground/80">{cp.concept}</div>
      </div>

      <h4 className="text-lg font-bold leading-relaxed text-foreground md:text-xl">
        {cp.question}
      </h4>

      <div className="space-y-2.5">
        {cp.options.map((opt, i) => {
          const isPicked = picked === i;
          const showRight = revealed && opt.correct;
          const showWrong = revealed && isPicked && !opt.correct;
          return (
            <button
              key={i}
              disabled={revealed}
              onClick={() => setPicked(i)}
              className={cn(
                "w-full rounded-2xl border-2 p-4 text-right transition-all",
                !revealed && isPicked && "border-primary bg-primary-soft",
                !revealed && !isPicked && "border-border bg-white hover:border-primary/50",
                showRight && "border-[oklch(0.6_0.17_155)] bg-[oklch(0.95_0.05_155)]",
                showWrong && "border-destructive/60 bg-destructive/5",
                revealed && !isPicked && !opt.correct && "opacity-60",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
                    !revealed && isPicked && "border-primary bg-primary text-primary-foreground",
                    !revealed && !isPicked && "border-border text-muted-foreground",
                    showRight && "border-[oklch(0.6_0.17_155)] bg-[oklch(0.6_0.17_155)] text-white",
                    showWrong && "border-destructive bg-destructive text-white",
                  )}
                >
                  {showRight ? "✓" : showWrong ? "✕" : String.fromCharCode(65 + i)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold leading-relaxed text-foreground">
                    {opt.label}
                  </div>
                  <AnimatePresence>
                    {revealed && (showRight || showWrong) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2 text-xs leading-relaxed text-muted-foreground"
                      >
                        {opt.why}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-2xl border p-4 text-sm leading-relaxed",
              isCorrect
                ? "border-[oklch(0.6_0.17_155)]/30 bg-[oklch(0.95_0.05_155)] text-[oklch(0.35_0.15_155)]"
                : "border-destructive/30 bg-destructive/5 text-destructive",
            )}
          >
            {isCorrect ? (
              <span>
                🎯 <strong>ممتاز.</strong> ربطتَ المفهوم بمشروع «عالمي العربي» بشكل صحيح — يمكنك إضاءة هذه المحطة.
              </span>
            ) : (
              <span>
                🤔 <strong>ليست الإجابة المُثلى.</strong> اقرأ التفسير أعلاه، ثم أعِد المحاولة أو راجع التحدي.
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          onClick={onRetryChallenge}
          className="rounded-full border border-border px-5 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted"
        >
          ← عودة للتحدي
        </button>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            disabled={picked === null}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-node)] hover:brightness-110 disabled:opacity-40"
          >
            تحقّق من إجابتي
          </button>
        ) : isCorrect ? (
          <button
            onClick={onPass}
            className="rounded-full bg-[color:var(--gold-deep)] px-6 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-gold)] hover:brightness-110"
          >
            أضِئ هذه المحطة ✨
          </button>
        ) : (
          <button
            onClick={() => {
              setPicked(null);
              setRevealed(false);
            }}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-node)] hover:brightness-110"
          >
            حاول مرة أخرى
          </button>
        )}
      </div>
    </div>
  );
}
