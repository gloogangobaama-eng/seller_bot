import React, { useState } from 'react'
import CommentModal from './CommentModal'

export default function Step3({ data, onUpdate, onNext, onSkip }) {
  const [showModal, setShowModal] = useState(false)
  const [links, setLinks] = useState(data.links || '')

  const handleNext = () => {
    onUpdate({ links })
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
        <div>
          <p className="font-mono text-xs tracking-widest text-nude-muted uppercase mb-2">
            Шаг 3 — Ссылки
          </p>
          <h2 className="font-display text-2xl text-nude leading-snug">
            Ссылки на ресурсы
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

        {/* Examples */}
        <div className="flex flex-wrap gap-2">
          {['Сайт', 'Instagram', 'ВКонтакте', 'Авито', 'Wildberries'].map((example) => (
            <span
              key={example}
              className="font-mono text-xs px-2.5 py-1 rounded-full text-nude-muted"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(222, 186, 154, 0.1)' }}
            >
              {example}
            </span>
          ))}
        </div>

        {/* Links textarea */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs tracking-widest text-nude-muted uppercase">
            Ссылки
          </label>
          <textarea
            value={links}
            onChange={(e) => setLinks(e.target.value)}
            placeholder={`https://example.com\nhttps://vk.com/supplier\nhttps://www.instagram.com/supplier`}
            rows={5}
            className="input-field rounded-xl px-4 py-3.5 text-base resize-none font-mono text-sm leading-relaxed"
            style={{ minHeight: '130px' }}
          />
          <p className="font-mono text-xs text-nude-muted">
            По одной ссылке на строку
          </p>
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
        stepLabel="Шаг 3 — Ссылки"
      />
    </>
  )
}
