import React, { useState, useEffect, useRef } from 'react'

export default function CommentModal({ isOpen, onClose, onSave, existingComment, stepLabel }) {
  const [text, setText] = useState(existingComment || '')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setText(existingComment || '')
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }, [isOpen, existingComment])

  if (!isOpen) return null

  const handleSave = () => {
    onSave(text.trim())
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg rounded-2xl card-surface p-6 animate-slide-in"
        style={{ maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-mono text-xs tracking-widest text-nude-muted uppercase mb-1">
              {stepLabel}
            </p>
            <h3 className="font-display text-lg text-nude">Комментарий</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-nude/20 text-nude-muted hover:text-nude hover:border-nude/40 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Добавьте любую дополнительную информацию..."
          rows={5}
          className="input-field w-full rounded-xl p-4 text-base resize-none font-sans leading-relaxed"
          style={{ minHeight: '120px' }}
        />

        <p className="mt-2 text-xs font-mono text-nude-muted">
          {text.length} символов
        </p>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="btn-ghost flex-1 py-3 px-4 rounded-xl"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="btn-primary flex-1 py-3 px-4 rounded-xl text-surface-900 font-semibold"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  )
}
