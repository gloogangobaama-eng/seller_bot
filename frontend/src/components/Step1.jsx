import React, { useState } from 'react'
import CommentModal from './CommentModal'

export default function Step1({ data, onUpdate, onNext, onSkip }) {
  const [showModal, setShowModal] = useState(false)
  const [localName, setLocalName] = useState(data.fullName || '')
  const [localCompany, setLocalCompany] = useState(data.company || '')

  const handleNext = () => {
    onUpdate({ fullName: localName, company: localCompany })
    onNext()
  }

  const handleSkip = () => {
    onSkip()
  }

  const handleSaveComment = (comment) => {
    onUpdate({ comment })
  }

  return (
    <>
      <div className="flex flex-col gap-6 animate-fade-up">
        {/* Header */}
        <div className="opacity-0-initial animate-fade-up">
          <p className="font-mono text-xs tracking-widest text-nude-muted uppercase mb-2">
            Шаг 1 — Основная информация
          </p>
          <h2 className="font-display text-2xl text-nude leading-snug">
            ФИО и компания
          </h2>
        </div>

        {/* Optional badge */}
        <div
          className="inline-flex items-center gap-2 py-2 px-3 rounded-lg opacity-0-initial animate-fade-up animate-delay-100"
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

        {/* Fields */}
        <div className="flex flex-col gap-4 opacity-0-initial animate-fade-up animate-delay-200">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs tracking-widest text-nude-muted uppercase">
              ФИО
            </label>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="Иванов Иван Иванович"
              className="input-field rounded-xl px-4 py-3.5 text-base"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs tracking-widest text-nude-muted uppercase">
              Название компании
            </label>
            <input
              type="text"
              value={localCompany}
              onChange={(e) => setLocalCompany(e.target.value)}
              placeholder="ООО «Название»"
              className="input-field rounded-xl px-4 py-3.5 text-base"
            />
          </div>
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
        <div className="flex flex-col gap-3 opacity-0-initial animate-fade-up animate-delay-300">
          <button
            onClick={handleNext}
            className="btn-primary w-full py-4 rounded-2xl text-surface-900 font-semibold font-mono tracking-wider"
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
        stepLabel="Шаг 1 — ФИО и компания"
      />
    </>
  )
}
