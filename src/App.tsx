import { useState } from 'react'
import LeadsTable from './components/LeadsTable'
import LeadDetail from './components/LeadDetail'
import OpportunitiesTable from './components/OpportunitiesTable'
import ConfirmDialog from './components/ConfirmDialog'
import { useLeads } from './hooks/useLeads'
import type { Lead, Opportunity } from './types/models'

export default function App() {
  const leads = useLeads()
  const [selected, setSelected] = useState<Lead | null>(null)
  const [opps, setOpps] = useState<Opportunity[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toRemoveId, setToRemoveId] = useState<string | null>(null)

  const handleRowClick = (lead: Lead) => setSelected(lead)

  const handleSaveLead = async (updated: Lead) => {
    try {
      await leads.updateLead(updated)
      setSelected(null)
    } catch (e) {
      alert((e as Error).message || 'Failed to save')
    }
  }

  const handleConvert = (lead: Lead, amount?: number) => {
    if (opps.some(o => o.leadId === lead.id)) {
      alert('An opportunity for this lead already exists.')
      return
    }
    const newOpp: Opportunity = {
      id: `O-${Date.now()}`,
      leadId: lead.id,
      stage: 'New',
      amount
    }
    setOpps(prev => [...prev, newOpp])
    setSelected(null)
  }

  const requestRemoveOpportunity = (opportunityId: string) => {
    setToRemoveId(opportunityId)
    setConfirmOpen(true)
  }

  const confirmRemove = () => {
    if (toRemoveId) setOpps(prev => prev.filter(o => o.id !== toRemoveId))
    setToRemoveId(null)
    setConfirmOpen(false)
  }

  const cancelRemove = () => {
    setToRemoveId(null)
    setConfirmOpen(false)
  }

  const getLead = (leadId: string) =>
    leads.getById(leadId) ?? (selected?.id === leadId ? selected : undefined)

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Mini Seller Console</h1>
        <p className="text-sm text-gray-600">
          Triage leads, edit details, and convert to opportunities.
        </p>
      </div>

      <LeadsTable
        leads={leads.leads}
        loading={leads.loading}
        error={leads.error}
        query={leads.query}
        setQuery={leads.setQuery}
        status={leads.status}
        setStatus={leads.setStatus}
        sort={leads.sort}
        setSort={leads.setSort}
        onRowClick={handleRowClick}
      />

      <OpportunitiesTable
        opportunities={opps}
        getLead={getLead}
        onRemove={requestRemoveOpportunity}
      />

      <LeadDetail
        lead={selected}
        onClose={() => setSelected(null)}
        onSave={handleSaveLead}
        onConvert={handleConvert}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Remove opportunity?"
        description="This action cannot be undone."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
      />
    </div>
  )
}
