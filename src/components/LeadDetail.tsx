import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import type { Lead, LeadStatus } from '../types/models'
import { Button, Field, IconButton, Input, Label, Select, Spinner } from './UI'
import { X, Save, CircleDollarSign } from 'lucide-react'
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
  const [openAnim, setOpenAnim] = useState(false)

  useEffect(() => {
    if (lead) {
      requestAnimationFrame(() => setOpenAnim(true))
      panelRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      setOpenAnim(false)
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [lead])

  useEffect(() => {
    setEmail(lead?.email ?? '')
    setStatus((lead?.status as LeadStatus) ?? 'new')
    setAmount('')
    setError(null)
    setSaving(false)
  }, [lead])

  if (!lead) return null

  const parsedAmount = amount.trim() === '' ? undefined : Number(amount.replace(',', '.'))
  const amountInvalid =
    amount.trim() !== '' && (Number.isNaN(parsedAmount as number) || (parsedAmount as number) < 0)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') smoothClose()
  }

  const smoothClose = () => {
    setOpenAnim(false)
    setTimeout(onClose, 250)
  }

  const handleSave = async () => {
    setError(null)
    if (!isValidEmail(email)) {
      setError('Invalid email format')
      return
    }
    setSaving(true)
    try {
      await Promise.resolve(onSave({ ...lead, email, status }))
      smoothClose()
    } catch (e) {
      setError((e as Error).message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex pointer-events-none">
      <div
        className={`fixed inset-0 z-[101] bg-black/40 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto ${openAnim ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
        onClick={smoothClose}
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-detail-title"
        onKeyDown={handleKeyDown}
        onClick={e => e.stopPropagation()}
        className={`ml-auto z-[102] flex h-full w-full max-w-md transform flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out focus:outline-none pointer-events-auto md:rounded-l-2xl ${openAnim ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div>
            <h2 id="lead-detail-title" className="text-lg font-semibold text-gray-900">
              Lead detail
            </h2>
            <p className="text-xs text-gray-500">Edit contact info and convert to opportunity</p>
          </div>
          <IconButton aria-label="Close panel" onClick={smoothClose} rounded="full">
            <X className="h-5 w-5" />
          </IconButton>
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

        <footer className="sticky bottom-0 z-10 flex flex-wrap justify-end gap-2 border-t bg-white/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <Button variant="secondary" onClick={smoothClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !isValidEmail(email)}>
            {saving ? <Spinner /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving…' : 'Save'}
          </Button>
          <Button
            onClick={() => {
              onConvert({ ...lead, email, status }, parsedAmount)
              smoothClose()
            }}
            disabled={amountInvalid}
          >
            <CircleDollarSign className="h-4 w-4" />
            Convert to Opportunity
          </Button>
        </footer>
      </div>
    </div>
  )
}
