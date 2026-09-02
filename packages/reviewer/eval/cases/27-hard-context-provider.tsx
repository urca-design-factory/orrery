// @expect C-01 P-05 P-06
import { createContext, useContext, useMemo, useState } from "react";

interface WizardContextValue {
  step: number;
  total: number;
  next: () => void;
  back: () => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

function useWizard(): WizardContextValue {
  const context = useContext(WizardContext);
  if (!context) throw new Error("useWizard must be used within a Wizard");
  return context;
}

export interface WizardProps {
  /** Number of steps in the flow. */
  total: number;
  /** Heading shown at the top of every step. */
  headerTitle: string;
  /** Optional secondary line below the heading. */
  headerSubtitle?: string;
  /** Element rendered at the end of the header row. */
  headerAction?: React.ReactNode;
  /** The current step's content. */
  bodyContent: React.ReactNode;
  /** Padding applied to the body region. */
  bodyPadding?: "none" | "sm" | "md";
  /** Text of the advance button. */
  footerNextLabel?: string;
  /** Text of the back button. */
  footerBackLabel?: string;
  /** Alignment of the footer buttons. */
  footerAlign?: "start" | "end" | "between";
  /** Called after the final step completes. */
  onFinish?: () => void;
}

/** A multi-step form flow. */
export function Wizard({
  total,
  headerTitle,
  headerSubtitle,
  headerAction,
  bodyContent,
  footerNextLabel = "Next",
  footerBackLabel = "Back",
  onFinish,
}: WizardProps) {
  const [step, setStep] = useState(0);

  const value = useMemo<WizardContextValue>(
    () => ({
      step,
      total,
      next: () => (step === total - 1 ? onFinish?.() : setStep((s) => s + 1)),
      back: () => setStep((s) => Math.max(0, s - 1)),
    }),
    [step, total, onFinish],
  );

  return (
    <WizardContext.Provider value={value}>
      <div className="rounded-lg border border-border-default bg-bg-surface">
        <div className="flex items-center justify-between border-b border-border-default p-4">
          <div>
            <p className="font-medium text-fg-primary">{headerTitle}</p>
            {headerSubtitle ? (
              <p className="text-sm text-fg-secondary">{headerSubtitle}</p>
            ) : null}
          </div>
          {headerAction}
        </div>

        <div className="p-4">{bodyContent}</div>

        <div className="flex justify-end gap-2 border-t border-border-default p-4">
          <button type="button" onClick={value.back}>
            {footerBackLabel}
          </button>
          <button type="button" onClick={value.next}>
            {footerNextLabel}
          </button>
        </div>
      </div>
    </WizardContext.Provider>
  );
}

export { useWizard };
