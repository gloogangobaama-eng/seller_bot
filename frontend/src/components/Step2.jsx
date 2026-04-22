import React, { useState } from 'react'
import CommentModal from './CommentModal'

export default function Step2({ data, onUpdate, onNext, onSkip }) {
  const [showModal, setShowModal] = useState(false)
  const [entityType, setEntityType] = useState(data.entityType || 'individual')
  const [inn, setInn] = useState(data.inn || '')
  const [error, setError] = useState('')

  const expectedLength = entityType === 'individual' ? 12 : 10

  const handleInnChange = (e) => {
    const val = e.target.value.replace(/\D/g, '')
    if (val.length <= expectedLength) {
      setInn(val)
      setError('')
    }
  }

  const handleEntityChange = (type) => {
    setEntityType(type)
    setInn('')
    setError('')
  }

  const handleNext = () => {
    if (inn.length > 0 && inn.length !== expectedLength) {
      setError(`ИНН должен содержать ${expectedLength} цифр`)
      return
    }
    onUpdate({ entityType, inn })
    onNext()
  }

  const handleSkip = () => {
    onSkip()
  }

  const handleSaveComment = (comment) => {
    onUpdate({ comment })
  }

  const isValid = inn.length === 0 || inn.length === expectedLength

  return (
    <>
      <div className="flex flex-col gap-6 animate-fade-up">
        {/* Header */}
        <div>
          <p className="font-mono text-xs tracking-widest text-nude-muted uppercase mb-2">
            Шаг 2 — Идентификация
          </p>
          <h2 className="font-display text-2xl text-nude leading-snug">
            ИНН
          </h2>
        </div>

        {/* Optional badge */}
        <div
          className="inline-flex items-center gap-2 py-2 px-3 rounded-lg"
          style={{ background: 'rgba(222, 186, 154, 0.06)', border: '1px solid rgba(222, 186, 154, 0.12)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" className="text-nude-muted" />
            <path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-nude-muted" />
          </svg>
          <p className="font-mono text-xs text-nude-muted">
            Необязательно — но ускоряет проверку
          </p>
        </div>

        {/* Entity type selector */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs tracking-widest text-nude-muted uppercase">
            Тип лица
          </label>
          <div
            className="grid grid-cols-2 gap-1 p-1 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(222, 186, 154, 0.1)' }}
          >
            {[
              { id: 'individual', label: 'Физ. лицо / ИП', sub: '12 цифр' },
              { id: 'company', label: 'Юр. лицо', sub: '10 цифр' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleEntityChange(opt.id)}
                className="flex flex-col items-center py-3 px-2 rounded-lg transition-all duration-300"
                style={
                  entityType === opt.id
                    ? {
                        background: 'linear-gradient(135deg, rgba(154, 99, 64, 0.3), rgba(222, 186, 154, 0.15))',
                        border: '1px solid rgba(222, 186, 154, 0.3)',
                      }
                    : {
                        background: 'transparent',
                        border: '1px solid transparent',
                      }
                }
              >
                <span
                  className={`font-sans text-sm transition-colors ${
                    entityType === opt.id ? 'text-nude' : 'text-nude-muted'
                  }`}
                >
                  {opt.label}
                </span>
                <span className="font-mono text-xs text-nude-muted mt-0.5">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* INN input */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs tracking-widest text-nude-muted uppercase">
            Номер ИНН
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inn}
              onChange={handleInnChange}
              placeholder={`${'_'.repeat(expectedLength)}`}
              className={`input-field rounded-xl px-4 py-3.5 text-base font-mono tracking-wider w-full ${
                error ? 'border-red-500/50' : ''
              }`}
            />
            {/* Progress indicator */}
            {inn.length > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <span className="font-mono text-xs text-nude-muted">
                  {inn.length}/{expectedLength}
                </span>
                {inn.length === expectedLength && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7l3 3 6-6" stroke="#c99a72" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            )}
          </div>
          {error && (
            <p className="font-mono text-xs text-red-400/80 animate-fade-in">{error}</p>
          )}
        </div>

        {/* Comment indicator */}
        {data.comment && (
          <div
            className="flex items-center gap-2 py-2.5 px-3 rounded-lg animate-fade-in"
            style={{ background: 'rgba(182, 125, 82, 0.08)', border: '1px solid rgba(182, 125, 82, 0.2)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2h10v8H8l-2 2v-2H2V2z" stroke="#c99a72" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
            <p className="font-mono text-xs text-nude-muted flex-1 truncate">{data.comment}</p>
            <button
              onClick={() => setShowModal(true)}
              className="font-mono text-xs text-nude/60 hover:text-nude transition-colors"
            >
              Изменить
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleNext}
            disabled={!isValid && inn.length > 0}
            className="btn-primary w-full py-4 rounded-2xl text-surface-900 font-semibold font-mono tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Далее →
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="btn-ghost flex-1 py-3 rounded-xl text-sm"
            >
              Пропустить
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="btn-ghost flex-1 py-3 rounded-xl text-sm"
            >
              {data.comment ? '✎ Комментарий' : '+ Комментарий'}
            </button>
          </div>
        </div>
      </div>

      <CommentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveComment}
        existingComment={data.comment}
        stepLabel="Шаг 2 — ИНН"
      />
    </>
  )
}
