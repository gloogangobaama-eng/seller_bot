import React, { useState } from 'react'
import { useTelegram } from './hooks/useTelegram'
import ProgressBar from './components/ProgressBar'
import Step1 from './components/Step1'
import Step2 from './components/Step2'
import Step3 from './components/Step3'
import Step4 from './components/Step4'

// Ambient background decoration
function AmbientBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Top radial glow */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(182,125,82,0.4) 0%, transparent 70%)' }}
      />
      {/* Bottom left accent */}
      <div
        className="absolute bottom-0 -left-20 w-64 h-64 rounded-full blur-3xl opacity-10"
        style={{ background: 'radial-gradient(circle, rgba(222,186,154,0.3) 0%, transparent 70%)' }}
      />
    </div>
  )
}

// Landing screen (Step -1)
function LandingScreen({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative">
      <AmbientBg />
      <div className="relative z-10 flex flex-col items-center gap-8 animate-fade-up">
        {/* Logo mark */}
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(154,99,64,0.2), rgba(222,186,154,0.1))', border: '1px solid rgba(222,186,154,0.15)' }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M8 10h20M8 18h14M8 26h17" stroke="#deba9a" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="27" cy="26" r="6" fill="rgba(182,125,82,0.15)" stroke="#c99a72" strokeWidth="1.5" />
            <path d="M24.5 26l1.5 1.5 3-3" stroke="#c99a72" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="font-display text-3xl font-semibold text-nude leading-tight">
            Верификация<br />поставщика
          </h1>
          <p className="font-sans text-base text-nude/60 leading-relaxed max-w-xs">
            Здравствуйте. Для начала сотрудничества необходимо пройти быструю проверку. Это займет несколько минут.
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {[
            { icon: '◎', text: '4 шага проверки' },
            { icon: '◈', text: 'Безопасная передача данных' },
            { icon: '◷', text: 'Результат в течение 24 часов' },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 py-2.5 px-4 rounded-xl opacity-0-initial animate-fade-up`}
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(222, 186, 154, 0.08)',
                animationDelay: `${(i + 1) * 150}ms`,
              }}
            >
              <span className="text-nude-muted font-mono text-base">{item.icon}</span>
              <span className="font-sans text-sm text-nude/60">{item.text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="btn-primary w-full max-w-xs py-4 rounded-2xl text-surface-900 font-semibold font-mono tracking-wider opacity-0-initial animate-fade-up"
          style={{ animationDelay: '500ms' }}
        >
          Пройти верификацию
        </button>
      </div>
    </div>
  )
}

// Intro screen (Step 0)
function IntroScreen({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative">
      <AmbientBg />
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-sm w-full">
        <div className="flex flex-col gap-4 animate-fade-up">
          <p className="font-mono text-xs tracking-widest text-nude-muted uppercase">
            Процесс проверки
          </p>
          <h2 className="font-display text-2xl font-medium text-nude leading-snug">
            Как это работает
          </h2>
          <p className="font-sans text-base text-nude/60 leading-relaxed">
            Заполните короткую форму и приложите материалы. Это позволит ускорить проверку.
          </p>
        </div>

        {/* Steps preview */}
        <div className="flex flex-col gap-3 w-full">
          {[
            { num: '01', label: 'ФИО и компания', optional: true },
            { num: '02', label: 'ИНН', optional: true },
            { num: '03', label: 'Ссылки', optional: true },
            { num: '04', label: 'Медиа', optional: false },
          ].map((step, i) => (
            <div
              key={step.num}
              className="flex items-center gap-4 py-3 px-4 rounded-xl opacity-0-initial animate-fade-up"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(222, 186, 154, 0.08)',
                animationDelay: `${i * 100}ms`,
              }}
            >
              <span
                className="font-mono text-xs w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ background: 'rgba(182,125,82,0.12)', color: '#c99a72' }}
              >
                {step.num}
              </span>
              <span className="font-sans text-sm text-nude/80 flex-1">{step.label}</span>
              <span
                className="font-mono text-xs px-2 py-0.5 rounded-full"
                style={
                  step.optional
                    ? { background: 'rgba(255,255,255,0.04)', color: 'rgba(222,186,154,0.4)' }
                    : { background: 'rgba(182,125,82,0.15)', color: '#c99a72' }
                }
              >
                {step.optional ? 'опц.' : 'обяз.'}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="btn-primary w-full py-4 rounded-2xl text-surface-900 font-semibold font-mono tracking-wider opacity-0-initial animate-fade-up"
          style={{ animationDelay: '400ms' }}
        >
          Начать
        </button>
      </div>
    </div>
  )
}

// Success screen
function SuccessScreen({ onClose }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative">
      <AmbientBg />
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-sm w-full animate-fade-up">
        {/* Check mark */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(154,99,64,0.2), rgba(222,186,154,0.1))',
            border: '1px solid rgba(222,186,154,0.2)',
            boxShadow: '0 0 48px rgba(182,125,82,0.2)',
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M10 21l7 7 13-13"
              stroke="url(#check-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="check-grad" x1="10" y1="20" x2="30" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#9a6340" />
                <stop offset="1" stopColor="#deba9a" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-display text-3xl font-medium text-nude">
            Заявка отправлена
          </h2>
          <p className="font-sans text-base text-nude/60 leading-relaxed">
            Спасибо за предоставленную информацию. Мы проверим ее в течение 24 часов с момента подачи и сообщим результат в личные сообщения.
          </p>
        </div>

        <div
          className="w-full py-4 px-5 rounded-2xl flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(222,186,154,0.1)' }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="#c99a72" strokeWidth="1.4" />
            <path d="M10 6v5l3 2" stroke="#c99a72" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <p className="font-mono text-sm text-nude/60">Ожидайте ответа в течение 24 ч</p>
        </div>

        <button
          onClick={onClose}
          className="btn-primary w-full py-4 rounded-2xl text-surface-900 font-semibold font-mono tracking-wider"
        >
          Закрыть
        </button>
      </div>
    </div>
  )
}

// Error screen
function ErrorScreen({ message, onRetry }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative">
      <AmbientBg />
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-sm w-full animate-fade-up">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 10v8M16 22v1" stroke="rgba(239,68,68,0.8)" strokeWidth="2" strokeLinecap="round" />
            <path d="M5 27h22L16 5 5 27z" stroke="rgba(239,68,68,0.8)" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-2xl text-nude">Ошибка отправки</h2>
          <p className="font-sans text-sm text-nude/50">{message || 'Что-то пошло не так. Попробуйте ещё раз.'}</p>
        </div>
        <button onClick={onRetry} className="btn-primary w-full py-4 rounded-2xl text-surface-900 font-semibold font-mono">
          Попробовать снова
        </button>
      </div>
    </div>
  )
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────

const SCREENS = {
  LANDING: 'landing',
  INTRO: 'intro',
  STEP1: 'step1',
  STEP2: 'step2',
  STEP3: 'step3',
  STEP4: 'step4',
  SUCCESS: 'success',
  ERROR: 'error',
}

const initialFormData = {
  step1: { fullName: '', company: '', comment: '' },
  step2: { entityType: 'individual', inn: '', comment: '' },
  step3: { links: '', comment: '' },
  step4: { files: [], comment: '' },
}

const MAX_PHOTO_BYTES = 10 * 1024 * 1024
const MAX_FILE_BYTES = 50 * 1024 * 1024
const MAX_TOTAL_UPLOAD_BYTES = 90 * 1024 * 1024

export default function App() {
  const { tgUser, closeApp } = useTelegram()
  const [screen, setScreen] = useState(SCREENS.LANDING)
  const [formData, setFormData] = useState(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const updateStep = (step, data) => {
    setFormData((prev) => ({ ...prev, [step]: { ...prev[step], ...data } }))
  }

  const getStepNumber = () => {
    const map = {
      [SCREENS.STEP1]: 1,
      [SCREENS.STEP2]: 2,
      [SCREENS.STEP3]: 3,
      [SCREENS.STEP4]: 4,
    }
    return map[screen] || null
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const oversized = formData.step4.files.find((file) => {
        const limit = file.type.startsWith('image/') ? MAX_PHOTO_BYTES : MAX_FILE_BYTES
        return file.size > limit
      })
      if (oversized) {
        const limitMb = oversized.type.startsWith('image/') ? 10 : 50
        throw new Error(`Файл "${oversized.name}" больше ${limitMb} MB. Сожмите его или выберите файл поменьше.`)
      }

      const totalSize = formData.step4.files.reduce((sum, file) => sum + file.size, 0)
      if (totalSize > MAX_TOTAL_UPLOAD_BYTES) {
        throw new Error('Общий размер файлов больше 90 MB. Оставьте меньше файлов или сожмите видео.')
      }

      const fd = new FormData()

      // Append files
      formData.step4.files.forEach((file) => {
        fd.append('media', file)
      })

      // Append JSON data
      const payload = {
        step1: formData.step1,
        step2: formData.step2,
        step3: formData.step3,
        step4Comment: formData.step4.comment,
        tgUser,
      }
      fd.append('data', JSON.stringify(payload))

      const res = await fetch('/api/submit', {
        method: 'POST',
        body: fd,
      })

      if (!res.ok) {
        const errText = await res.text()
        let message = errText || `HTTP ${res.status}`

        try {
          const json = JSON.parse(errText)
          message = json.error || message
        } catch {
          if (errText.includes('Internal Error')) {
            message = 'Видео слишком большое или сервер не смог обработать загрузку. Сожмите видео и попробуйте снова.'
          }
        }

        throw new Error(message)
      }

      setScreen(SCREENS.SUCCESS)
    } catch (err) {
      console.error('Submit error:', err)
      setErrorMessage(err.message)
      setScreen(SCREENS.ERROR)
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepNum = getStepNumber()

  return (
    <div className="min-h-screen bg-surface-900 relative">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Screens */}
      {screen === SCREENS.LANDING && (
        <LandingScreen onStart={() => setScreen(SCREENS.INTRO)} />
      )}

      {screen === SCREENS.INTRO && (
        <IntroScreen onStart={() => setScreen(SCREENS.STEP1)} />
      )}

      {screen === SCREENS.SUCCESS && (
        <SuccessScreen onClose={closeApp} />
      )}

      {screen === SCREENS.ERROR && (
        <ErrorScreen message={errorMessage} onRetry={() => setScreen(SCREENS.STEP4)} />
      )}

      {/* Form steps */}
      {[SCREENS.STEP1, SCREENS.STEP2, SCREENS.STEP3, SCREENS.STEP4].includes(screen) && (
        <div className="min-h-screen flex flex-col">
          {/* Progress */}
          <div
            className="sticky top-0 z-20"
            style={{ background: 'rgba(15,13,11,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(222,186,154,0.06)' }}
          >
            <ProgressBar currentStep={stepNum} totalSteps={4} />
          </div>

          {/* Content */}
          <div className="flex-1 px-5 py-6 relative z-10">
            <AmbientBg />
            <div className="relative z-10 max-w-lg mx-auto">
              {screen === SCREENS.STEP1 && (
                <Step1
                  data={formData.step1}
                  onUpdate={(d) => updateStep('step1', d)}
                  onNext={() => setScreen(SCREENS.STEP2)}
                  onSkip={() => setScreen(SCREENS.STEP2)}
                />
              )}
              {screen === SCREENS.STEP2 && (
                <Step2
                  data={formData.step2}
                  onUpdate={(d) => updateStep('step2', d)}
                  onNext={() => setScreen(SCREENS.STEP3)}
                  onSkip={() => setScreen(SCREENS.STEP3)}
                />
              )}
              {screen === SCREENS.STEP3 && (
                <Step3
                  data={formData.step3}
                  onUpdate={(d) => updateStep('step3', d)}
                  onNext={() => setScreen(SCREENS.STEP4)}
                  onSkip={() => setScreen(SCREENS.STEP4)}
                />
              )}
              {screen === SCREENS.STEP4 && (
                <Step4
                  data={formData.step4}
                  onUpdate={(d) => updateStep('step4', d)}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
