import { useEffect, useRef } from 'react'
import { Button, IconButton } from './UI'
import { X, AlertTriangle } from 'lucide-react'

interface Props {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  if (!open) return null

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onCancel()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none" onKeyDown={handleKeyDown}>
      <div className="fixed inset-0 bg-black/50 pointer-events-auto" aria-hidden="true" onClick={onCancel} />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        className="pointer-events-auto z-[61] mx-4 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl focus:outline-none"
      >
        <div className="flex items-start gap-3 border-b p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" aria-hidden="true" />
          <div className="flex-1">
            <h3 id="confirm-title" className="text-base font-semibold text-gray-900">{title}</h3>
            {description && (
              <p id="confirm-desc" className="mt-1 text-sm text-gray-600">{description}</p>
            )}
          </div>
          <IconButton aria-label="Close" onClick={onCancel}>
            <X className="h-5 w-5" />
          </IconButton>
        </div>
        <div className="flex justify-end gap-2 p-4">
          <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}
