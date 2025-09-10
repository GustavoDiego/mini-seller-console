import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import type { Lead, LeadStatus } from '../types/models'
import { Button, Field, Input, Label, Select } from './UI'
import { isValidEmail } from '../utils/validation'

interface Props {
  lead: Lead | null
  onClose: () => void
  onSave: (lead: Lead) => Promise<void> | void
  onConvert: (lead: Lead, amount?: number) => void
}

export default function LeadDetail({ lead, onClose, onSave, onConvert }: Props) {
  const [email, setEmail] = useState(lead?.email ?? '')
  const [status, setStatus] = useState<LeadStatus>(lead?.status ?? 'new')
  const [amount, setAmount] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (lead && panelRef.current) panelRef.current.focus()
  }, [lead])

  useEffect(() => {
    setEmail(lead?.email ?? '')
    setStatus((lead?.status as LeadStatus) ?? 'new')
    setAmount('')
    setError(null)
    setSaving(false)
  }, [lead])

  if (!lead) return null

  const handleSave = async () => {
    setError(null)
    if (!isValidEmail(email)) {
      setError('Invalid email format')
      return
    }
    setSaving(true)
    try {
      await Promise.resolve(onSave({ ...lead, email, status }))
    } catch (e) {
      setError((e as Error).message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }

  const parsedAmount =
    amount.trim() === '' ? undefined : Number(amount.replace(',', '.'))
  const amountInvalid =
    amount.trim() !== '' &&
    (Number.isNaN(parsedAmount as number) || (parsedAmount as number) < 0)

  return (
    <div className="fixed inset-0 z-50 flex pointer-events-none">
      <div
        className="fixed inset-0 z-40 bg-black/50 pointer-events-auto"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-xl focus:outline-none z-50 pointer-events-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-detail-title"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <header className="flex items-center justify-between border-b p-4">
          <h2 id="lead-detail-title" className="text-lg font-semibold text-gray-900">
            Lead Detail
          </h2>
          <Button variant="ghost" onClick={onClose} aria-label="Close panel">
            ✕
          </Button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <Field>
            <Label htmlFor="lead-name">Name</Label>
            <Input id="lead-name" value={lead.name} disabled />
          </Field>

          <Field>
            <Label htmlFor="lead-company">Company</Label>
            <Input id="lead-company" value={lead.company} disabled />
          </Field>

          <Field>
            <Label htmlFor="lead-email">Email</Label>
            <Input
              id="lead-email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              invalid={!!error && !isValidEmail(email)}
            />
          </Field>

          <Field>
            <Label htmlFor="lead-status">Status</Label>
            <Select
              id="lead-status"
              value={status}
              onChange={e => setStatus(e.target.value as LeadStatus)}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="disqualified">Disqualified</option>
            </Select>
          </Field>

          <Field>
            <Label htmlFor="lead-amount">Amount (USD)</Label>
            <Input
              id="lead-amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              invalid={amountInvalid}
              aria-describedby="lead-amount-hint"
            />
            <span id="lead-amount-hint" className="text-xs text-gray-500">
              Leave empty if unknown. Use dot for decimals.
            </span>
          </Field>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <footer className="flex flex-wrap justify-end gap-2 border-t p-4">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !isValidEmail(email)}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
          <Button
            onClick={() => onConvert({ ...lead, email, status }, parsedAmount)}
            disabled={amountInvalid}
          >
            Convert to Opportunity
          </Button>
        </footer>
      </div>
    </div>
  )
}
