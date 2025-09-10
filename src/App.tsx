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
    if (toRemoveId) {
      setOpps(prev => prev.filter(o => o.id !== toRemoveId))
    }
    setToRemoveId(null)
    setConfirmOpen(false)
  }

  const cancelRemove = () => {
    setToRemoveId(null)
    setConfirmOpen(false)
  }

  const getLead = (leadId: string) => leads.getById(leadId) ?? (selected?.id === leadId ? selected : undefined)

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Mini Seller Console</h1>
      </header>

      <section className="space-y-2">
        <h2 className="text-lg font-medium text-gray-800">Leads</h2>
        <LeadsTable {...leads} onRowClick={handleRowClick} />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium text-gray-800">Opportunities</h2>
        <OpportunitiesTable
          opportunities={opps}
          getLead={getLead}
          onRemove={requestRemoveOpportunity}
        />
      </section>

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
