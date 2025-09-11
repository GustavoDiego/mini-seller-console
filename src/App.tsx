import { useState } from 'react'
import AppBar from './components/AppBar'
import LeadsTable from './components/LeadsTable'
import LeadDetail from './components/LeadDetail'
import OpportunitiesTable from './components/OpportunitiesTable'
import ConfirmDialog from './components/ConfirmDialog'
import ObservabilityPanel from './components/ObservabilityPanel'
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

  const q = leads.query.trim().toLowerCase()
  const filteredOpps = opps.filter(opp => {
    if (!q) return true
    const lead = getLead(opp.leadId)
    const hay = [
      lead?.name,
      lead?.company,
      opp.stage,
      opp.amount != null ? String(opp.amount) : ''
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return hay.includes(q)
  })

  return (
    <>
      <AppBar
        title="Mini Seller Console"
        subtitle="Leads & Opportunities"
        searchValue={leads.query}
        onSearchChange={leads.setQuery}
      />

      <main className="mx-auto max-w-7xl space-y-8 p-6">
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
          opportunities={filteredOpps}
          getLead={getLead}
          onRemove={requestRemoveOpportunity}
        />

        <ObservabilityPanel />
      </main>

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
    </>
  )
}
