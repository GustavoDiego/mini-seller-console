import { useState } from 'react'
import LeadsTable from './components/LeadsTable'
import LeadDetail from './components/LeadDetail'
import OpportunitiesTable from './components/OpportunitiesTable'
import { useLeads } from './hooks/useLeads'
import type { Lead, Opportunity } from './types/models'
import { Button } from './components/UI'

export default function App() {
  const leads = useLeads()
  const [selected, setSelected] = useState<Lead | null>(null)
  const [opps, setOpps] = useState<Opportunity[]>([])

  const handleRowClick = (lead: Lead) => {
    setSelected(lead)
  }

  const handleSaveLead = (updated: Lead) => {
    const index = leads.leads.findIndex(l => l.id === updated.id)
    if (index !== -1) {
      leads.leads[index] = updated
    }
  }

  const handleConvert = (lead: Lead) => {
    const newOpp: Opportunity = {
      id: `O-${Date.now()}`,
      name: lead.name,
      stage: 'New',
      amount: undefined,
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
      />

      {selected && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button onClick={() => handleConvert(selected)}>
            Convert to Opportunity
          </Button>
        </div>
      )}
    </div>
  )
}
