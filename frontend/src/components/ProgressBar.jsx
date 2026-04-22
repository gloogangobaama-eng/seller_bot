import React from 'react'

const STEP_LABELS = ['ФИО', 'ИНН', 'Ссылки', 'Медиа']

export default function ProgressBar({ currentStep, totalSteps = 4 }) {
  return (
    <div className="px-6 pt-5 pb-3">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs text-nude-muted tracking-widest uppercase">
          Шаг {currentStep} из {totalSteps}
        </span>
        <span className="font-mono text-xs text-nude-muted">
          {STEP_LABELS[currentStep - 1]}
        </span>
      </div>

      {/* Track */}
      <div className="relative h-px bg-white/5 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${(currentStep / totalSteps) * 100}%`,
            background: 'linear-gradient(90deg, #7d4e32, #deba9a)',
          }}
        />
      </div>

      {/* Dots */}
      <div className="flex justify-between mt-2">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1
          const isDone = stepNum < currentStep
          const isActive = stepNum === currentStep
          return (
            <div key={label} className="flex flex-col items-center gap-1">
              <div
                className={`progress-dot w-1.5 h-1.5 rounded-full ${
                  isDone
                    ? 'bg-nude-400'
                    : isActive
                    ? 'bg-nude-300 shadow-lg shadow-nude-400/40'
                    : 'bg-white/10'
                }`}
                style={isActive ? { boxShadow: '0 0 8px rgba(222, 186, 154, 0.6)' } : {}}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
