import { useState } from 'react'
import LeadsTable from './components/LeadsTable'
import LeadDetail from './components/LeadDetail'
import OpportunitiesTable from './components/OpportunitiesTable'
import { useLeads } from './hooks/useLeads'
import type { Lead, Opportunity } from './types/models'

export default function App() {
  const leads = useLeads()
  const [selected, setSelected] = useState<Lead | null>(null)
  const [opps, setOpps] = useState<Opportunity[]>([])

  const handleRowClick = (lead: Lead) => {
    setSelected(lead)
  }

  const handleSaveLead = async (updated: Lead) => {
    try {
      await leads.updateLead(updated)
      setSelected(null)
    } catch (e) {
      alert((e as Error).message || 'Failed to save')
    }
  }

  const handleConvert = (lead: Lead, amount?: number) => {
    const newOpp: Opportunity = {
      id: `O-${Date.now()}`,
      name: lead.name,
      stage: 'New',
      amount,
      accountName: lead.company
    }
    setOpps(prev => [...prev, newOpp])
    setSelected(null)
  }

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
        <OpportunitiesTable opportunities={opps} />
      </section>

      <LeadDetail
        lead={selected}
        onClose={() => setSelected(null)}
        onSave={handleSaveLead}
        onConvert={handleConvert}
      />
    </div>
  )
}
