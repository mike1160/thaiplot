'use client'

import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'

const MAX_PHOTOS = 5
const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
const ALLOWED_EXT = /\.(jpe?g|png|webp)$/i
const BUCKET = 'listing-photos'

type PhotoSlot = {
  id: string
  fileName: string
  previewUrl: string
  publicUrl: string | null
  progress: number
  status: 'uploading' | 'done' | 'error'
  error?: string
}

type Props = {
  value: string[]
  onChange: (urls: string[]) => void
  onUploadingChange?: (uploading: boolean) => void
  label: string
  dropzoneText: string
  hint: string
  removeLabel: string
  errorTooLarge: string
  errorType: string
  errorUpload: string
  errorMax: string
}

function sanitizeFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() || 'photo.jpg'
  return base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80) || 'photo.jpg'
}

function isAllowedFile(file: File): boolean {
  if (ALLOWED_TYPES.has(file.type)) return true
  return ALLOWED_EXT.test(file.name)
}

function uploadWithProgress(
  file: File,
  path: string,
  onProgress: (pct: number) => void
): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return Promise.reject(new Error('Missing Supabase env'))
  }

  return new Promise((resolve, reject) => {
    const encodedPath = path
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/')
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${url}/storage/v1/object/${BUCKET}/${encodedPath}`)
    xhr.setRequestHeader('Authorization', `Bearer ${key}`)
    xhr.setRequestHeader('apikey', key)
    xhr.setRequestHeader('x-upsert', 'false')
    if (file.type) {
      xhr.setRequestHeader('Content-Type', file.type)
    }

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return
      onProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)))
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100)
        resolve()
        return
      }
      let message = `Upload failed (${xhr.status})`
      try {
        const parsed = JSON.parse(xhr.responseText) as { message?: string; error?: string }
        message = parsed.message || parsed.error || message
      } catch {
        // keep default
      }
      reject(new Error(message))
    }

    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.send(file)
  })
}

export default function PhotoUploader({
  value,
  onChange,
  onUploadingChange,
  label,
  dropzoneText,
  hint,
  removeLabel,
  errorTooLarge,
  errorType,
  errorUpload,
  errorMax,
}: Props) {
  const [slots, setSlots] = useState<PhotoSlot[]>(() =>
    value.filter(Boolean).map((url, i) => ({
      id: `existing-${i}-${url}`,
      fileName: `photo-${i + 1}`,
      previewUrl: url,
      publicUrl: url,
      progress: 100,
      status: 'done' as const,
    }))
  )
  const [dragOver, setDragOver] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const slotsRef = useRef(slots)
  slotsRef.current = slots

  // Restore drafts / external URL updates when idle
  useEffect(() => {
    if (slotsRef.current.some((s) => s.status === 'uploading')) return
    const current = slotsRef.current
      .filter((s) => s.status === 'done' && s.publicUrl)
      .map((s) => s.publicUrl as string)
    const incoming = value.filter(Boolean)
    const same =
      current.length === incoming.length && current.every((url, i) => url === incoming[i])
    if (same) return
    setSlots(
      incoming.map((url, i) => ({
        id: `existing-${i}-${url}`,
        fileName: `photo-${i + 1}`,
        previewUrl: url,
        publicUrl: url,
        progress: 100,
        status: 'done' as const,
      }))
    )
  }, [value])

  const syncUrls = useCallback(
    (next: PhotoSlot[]) => {
      const urls = next.filter((s) => s.status === 'done' && s.publicUrl).map((s) => s.publicUrl!)
      onChange(urls)
      onUploadingChange?.(next.some((s) => s.status === 'uploading'))
    },
    [onChange, onUploadingChange]
  )

  const updateSlot = useCallback(
    (id: string, patch: Partial<PhotoSlot>) => {
      setSlots((prev) => {
        const next = prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
        syncUrls(next)
        return next
      })
    },
    [syncUrls]
  )

  const removeSlot = useCallback(
    (id: string) => {
      setSlots((prev) => {
        const target = prev.find((s) => s.id === id)
        if (target?.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(target.previewUrl)
        }
        const next = prev.filter((s) => s.id !== id)
        syncUrls(next)
        return next
      })
      setLocalError(null)
    },
    [syncUrls]
  )

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files)
      if (!list.length) return

      setLocalError(null)
      const current = slotsRef.current
      const remaining = MAX_PHOTOS - current.length
      if (remaining <= 0) {
        setLocalError(errorMax)
        return
      }

      const accepted: File[] = []
      for (const file of list.slice(0, remaining)) {
        if (!isAllowedFile(file)) {
          setLocalError(errorType)
          continue
        }
        if (file.size > MAX_BYTES) {
          setLocalError(errorTooLarge)
          continue
        }
        accepted.push(file)
      }

      if (!accepted.length) return
      if (list.length > remaining) {
        setLocalError(errorMax)
      }

      const newSlots: PhotoSlot[] = accepted.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        fileName: file.name,
        previewUrl: URL.createObjectURL(file),
        publicUrl: null,
        progress: 0,
        status: 'uploading',
      }))

      setSlots((prev) => {
        const next = [...prev, ...newSlots]
        onUploadingChange?.(true)
        return next
      })

      const supabase = getSupabaseBrowser()

      await Promise.all(
        accepted.map(async (file, index) => {
          const slot = newSlots[index]
          const path = `listings/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${sanitizeFilename(file.name)}`

          try {
            await uploadWithProgress(file, path, (pct) => {
              updateSlot(slot.id, { progress: pct })
            })

            const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
            updateSlot(slot.id, {
              publicUrl: data.publicUrl,
              progress: 100,
              status: 'done',
            })
          } catch (err) {
            updateSlot(slot.id, {
              status: 'error',
              error: err instanceof Error ? err.message : errorUpload,
              progress: 0,
            })
          }
        })
      )
    },
    [errorMax, errorTooLarge, errorType, errorUpload, onUploadingChange, updateSlot]
  )

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files?.length) {
      void uploadFiles(e.dataTransfer.files)
    }
  }

  const doneCount = slots.filter((s) => s.status === 'done').length
  const canAdd = slots.length < MAX_PHOTOS

  return (
    <div className="space-y-3">
      <p className="block text-sm font-medium text-[#1A2744]">{label}</p>
      <p className="text-sm text-[#5C5247] leading-relaxed">{hint}</p>

      {canAdd ? (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              inputRef.current?.click()
            }
          }}
          onClick={() => inputRef.current?.click()}
          onDragEnter={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setDragOver(false)
          }}
          onDrop={onDrop}
          className={`rounded-[12px] border-2 border-dashed px-4 py-10 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-[#C8973A] bg-[#C8973A]/10'
              : 'border-[#E8E2D6] bg-[#FAF7F0] hover:border-[#C8973A]/70'
          }`}
        >
          <p className="text-sm font-medium text-[#1A2744]">{dropzoneText}</p>
          <p className="mt-1 text-xs text-[#5C5247]">
            JPG, PNG, WebP · max 5MB · {doneCount}/{MAX_PHOTOS}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) void uploadFiles(e.target.files)
              e.target.value = ''
            }}
          />
        </div>
      ) : null}

      {slots.length > 0 ? (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {slots.map((slot) => (
            <li
              key={slot.id}
              className="relative aspect-square rounded-[12px] overflow-hidden border border-[#E8E2D6] bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slot.previewUrl}
                alt={slot.fileName}
                className="h-full w-full object-cover"
              />

              {slot.status === 'uploading' ? (
                <div className="absolute inset-0 bg-[#1A2744]/55 flex flex-col items-center justify-center gap-2 px-2">
                  <div className="w-full max-w-[80%] h-1.5 rounded-full bg-white/30 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#C8973A] transition-[width] duration-150"
                      style={{ width: `${slot.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-white">{slot.progress}%</span>
                </div>
              ) : null}

              {slot.status === 'error' ? (
                <div className="absolute inset-0 bg-red-900/70 flex items-center justify-center p-2">
                  <p className="text-[11px] text-white text-center leading-snug">
                    {slot.error || errorUpload}
                  </p>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => removeSlot(slot.id)}
                className="absolute top-1.5 right-1.5 h-7 w-7 rounded-full bg-[#1A2744]/85 text-white text-sm leading-none hover:bg-[#C8973A] transition-colors"
                aria-label={removeLabel}
                title={removeLabel}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {localError ? <p className="text-sm text-red-700">{localError}</p> : null}
    </div>
  )
}
