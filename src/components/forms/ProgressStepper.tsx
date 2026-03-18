'use client';

import React from 'react';

interface Step {
  label: string;
  description?: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  allowClickAhead?: boolean;
}

export default function ProgressStepper({
  steps,
  currentStep,
  onStepClick,
  allowClickAhead = false,
}: ProgressStepperProps): React.ReactElement {
  return (
    <div className="w-full">
      <div className="flex items-start">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = allowClickAhead || index <= currentStep;

          return (
            <div key={index} className="flex-1 relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-0.5 ${
                    isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  style={{ transform: 'translateX(50%)' }}
                />
              )}

              {/* Step */}
              <div className="relative flex flex-col items-center">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick?.(index)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors z-10 ${
                    isCompleted
                      ? 'bg-blue-600 text-white'
                      : isCurrent
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-600'
                      : 'bg-gray-100 text-gray-500'
                  } ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </button>

                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      isCurrent ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
