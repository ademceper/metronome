/* eslint-disable */
// @ts-nocheck

/**
 * Wizard context and passthrough components used by the Keycloak admin theme.
 * Replaces the PatternFly Wizard family that used to live in the shim wrapper.
 */
import * as React from "react";
import { cn } from "@metronome/ui/lib/utils";

type WizardCtx = {
  activeStep: { id: string | undefined; name: string | undefined; index: number };
  goToNextStep: () => void;
  goToPrevStep: () => void;
  close: () => void;
  steps: any[];
};

const WizardContext = React.createContext<WizardCtx>({
  activeStep: { id: undefined, name: undefined, index: 0 },
  goToNextStep: () => {},
  goToPrevStep: () => {},
  close: () => {},
  steps: [],
});

export const useWizardContext = () => React.useContext(WizardContext);

export const Wizard = ({
  children,
  onClose,
  onSave,
  onStepChange,
  navAriaLabel,
  ...props
}: any) => (
  <WizardContext.Provider
    value={{
      activeStep: { id: undefined, name: undefined, index: 0 },
      goToNextStep: () => {},
      goToPrevStep: () => {},
      close: onClose ?? (() => {}),
      steps: [],
    }}
  >
    <div className={cn("flex flex-col gap-3", (props as any).className)} {...props}>
      {children}
    </div>
  </WizardContext.Provider>
);

export const WizardStep = ({ name, id, children, ...props }: any) => (
  <div data-step-id={id} data-step-name={name} {...props}>
    {children}
  </div>
);

export const WizardFooter = ({
  activeStep,
  onNext,
  onBack,
  onClose,
  children,
  isNextDisabled,
  nextButtonText,
  backButtonText,
  cancelButtonText,
  ...props
}: any) => (
  <div className="flex items-center justify-end gap-2 pt-3" {...props}>
    {children}
  </div>
);

export const WizardFooterWrapper = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center justify-end gap-2 pt-3", className)} {...props}>
    {children}
  </div>
);
