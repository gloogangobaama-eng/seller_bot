import React, { useState, useRef } from 'react'
import CommentModal from './CommentModal'

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const MAX_UPLOAD_MB = 5

export default function Step4({ data, onUpdate, onSubmit, isSubmitting }) {
  const [showModal, setShowModal] = useState(false)
  const [files, setFiles] = useState(data.files || [])
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files)
    if (newFiles.length === 0) return

    const oversized = newFiles.find((file) => file.size > MAX_UPLOAD_BYTES)
    if (oversized) {
      setError(`Файл "${oversized.name}" больше ${MAX_UPLOAD_MB} MB. Сожмите видео или выберите файл поменьше.`)
      e.target.value = ''
      return
    }

    const combined = [...files, ...newFiles]
    // Deduplicate by name+size
    const unique = combined.filter(
      (f, i, arr) => arr.findIndex((x) => x.name === f.name && x.size === f.size) === i
    )
    const totalSize = unique.reduce((sum, file) => sum + file.size, 0)
    if (totalSize > MAX_UPLOAD_BYTES) {
      setError(`Общий размер файлов больше ${MAX_UPLOAD_MB} MB. Оставьте меньше файлов или сожмите видео.`)
      e.target.value = ''
      return
    }

    setFiles(unique)
    onUpdate({ files: unique })
    setError('')
    e.target.value = ''
  }

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)
    onUpdate({ files: updated })
  }

  const handleSubmit = () => {
    if (files.length === 0) {
      setError('Необходимо загрузить хотя бы один файл')
      return
    }
    const oversized = files.find((file) => file.size > MAX_UPLOAD_BYTES)
    if (oversized) {
      setError(`Файл "${oversized.name}" больше ${MAX_UPLOAD_MB} MB. Сожмите видео или выберите файл поменьше.`)
      return
    }
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    if (totalSize > MAX_UPLOAD_BYTES) {
      setError(`Общий размер файлов больше ${MAX_UPLOAD_MB} MB. Оставьте меньше файлов или сожмите видео.`)
      return
    }
    onSubmit()
  }

  const handleSaveComment = (comment) => {
    onUpdate({ comment })
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (file) => {
    if (file.type.startsWith('video/')) {
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1" y="3" width="12" height="12" rx="2" stroke="#c99a72" strokeWidth="1.2" />
          <path d="M13 6.5l4-2v7l-4-2" stroke="#c99a72" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      )
    }
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="1" width="10" height="16" rx="2" stroke="#c99a72" strokeWidth="1.2" />
        <path d="M5 6h6M5 9h6M5 12h4" stroke="#c99a72" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M9 1v4h3" stroke="#c99a72" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-6 animate-fade-up">
        {/* Header */}
        <div>
          <p className="font-mono text-xs tracking-widest text-nude-muted uppercase mb-2">
            Шаг 4 — Медиа
          </p>
          <h2 className="font-display text-2xl text-nude leading-snug">
            Фото и видео
          </h2>
        </div>

        {/* Required badge */}
        <div
          className="inline-flex items-center gap-2 py-2 px-3 rounded-lg"
          style={{ background: 'rgba(222, 186, 154, 0.08)', border: '1px solid rgba(222, 186, 154, 0.2)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1l1.5 4h4.5l-3.5 2.5 1.5 4L7 9l-3.5 2.5 1.5-4L1.5 5H6z" stroke="#deba9a" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
          <p className="font-mono text-xs text-nude">
            Обязательный шаг
          </p>
        </div>

        {/* Instructions */}
        <div
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(222, 186, 154, 0.08)' }}
        >
          <p className="font-mono text-xs tracking-widest text-nude-muted uppercase">Инструкция</p>
          <ul className="flex flex-col gap-2.5">
            {[
              'Снимите фото или видео товара или склада',
              'В кадре должен быть лист с текстом POSTAVKA_Q23_',
              'В видео покажите его несколько раз',
              'Допускается несколько файлов',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span
                  className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center font-mono text-xs"
                  style={{ background: 'rgba(182, 125, 82, 0.15)', color: '#c99a72' }}
                >
                  {i + 1}
                </span>
                <span className="font-sans text-sm text-nude/70 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          {/* Code label */}
          <div
            className="mt-1 py-2 px-3 rounded-lg text-center font-mono text-sm tracking-widest"
            style={{ background: 'rgba(182, 125, 82, 0.1)', border: '1px solid rgba(182, 125, 82, 0.25)', color: '#deba9a' }}
          >
            POSTAVKA_Q23_
          </div>
        </div>

        {/* Upload area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 group"
          style={{ borderColor: files.length > 0 ? 'rgba(182, 125, 82, 0.3)' : 'rgba(222, 186, 154, 0.15)' }}
        >
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'rgba(182, 125, 82, 0.04)' }}
          />
          <div className="relative p-6 flex flex-col items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{ background: 'rgba(182, 125, 82, 0.12)' }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V9.5L13.5 4H6c-1.1 0-2 .9-2 2v10z" stroke="#c99a72" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M13 4v4.5h4.5" stroke="#c99a72" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11 11v5M8.5 13.5L11 11l2.5 2.5" stroke="#c99a72" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-sans text-sm text-nude/80">Нажмите чтобы выбрать файлы</p>
              <p className="font-mono text-xs text-nude-muted mt-1">Фото или видео · До 5 MB всего</p>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        {/* File list */}
        {files.length > 0 && (
          <div className="flex flex-col gap-2 animate-fade-in">
            <p className="font-mono text-xs tracking-widest text-nude-muted uppercase">
              Загружено {files.length} {files.length === 1 ? 'файл' : files.length < 5 ? 'файла' : 'файлов'}
            </p>
            {files.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2.5 px-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(222, 186, 154, 0.1)' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(182, 125, 82, 0.1)' }}
                >
                  {getFileIcon(file)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-nude/80 truncate">{file.name}</p>
                  <p className="font-mono text-xs text-nude-muted">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-nude-muted hover:text-nude transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="font-mono text-xs text-red-400/80 animate-fade-in">{error}</p>
        )}

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
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary w-full py-4 rounded-2xl text-surface-900 font-semibold font-mono tracking-wider disabled:opacity-50 relative overflow-hidden"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="30" strokeDashoffset="10" />
                </svg>
                Отправляется...
              </span>
            ) : (
              'Отправить заявку →'
            )}
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="btn-ghost w-full py-3 rounded-xl text-sm"
          >
            {data.comment ? '✎ Изменить комментарий' : '+ Оставить комментарий'}
          </button>
        </div>
      </div>

      <CommentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveComment}
        existingComment={data.comment}
        stepLabel="Шаг 4 — Медиа"
      />
    </>
  )
}
