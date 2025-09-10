import { useState } from 'react'
import type { Lead, LeadStatus } from '../types/models'
import { Button, Field, Input, Label, Select } from './UI'
import { isValidEmail } from '../utils/validation'

interface Props {
  lead: Lead | null
  onClose: () => void
  onSave: (lead: Lead) => void
}

export default function LeadDetail({ lead, onClose, onSave }: Props) {
  const [email, setEmail] = useState(lead?.email ?? '')
  const [status, setStatus] = useState<LeadStatus>(lead?.status ?? 'new')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!lead) return null

  const handleSave = async () => {
    setError(null)
    if (!isValidEmail(email)) {
      setError('Invalid email format')
      return
    }
    setSaving(true)
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() < 0.9 ? resolve(true) : reject(new Error('Failed to save'))
        }, 600)
      })
      onSave({ ...lead, email, status })
      onClose()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-black/50"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-xl focus:outline-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-detail-title"
      >
        <header className="flex items-center justify-between border-b p-4">
          <h2 id="lead-detail-title" className="text-lg font-semibold text-gray-900">
            Lead Detail
          </h2>
          <Button variant="ghost" onClick={onClose} aria-label="Close panel">
            ✕
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <footer className="flex justify-end gap-2 border-t p-4">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </footer>
      </div>
    </div>
  )
}
