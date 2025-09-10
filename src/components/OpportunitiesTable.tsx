import type { Lead, Opportunity } from '../types/models'
import { Badge, IconButton, Table, Tbody, Td, Th, Thead, Tr } from './UI'
import { Trash2 } from 'lucide-react'

interface Props {
  opportunities: Opportunity[]
  getLead: (leadId: string) => Lead | undefined
  onRemove: (opportunityId: string) => void
}

export default function OpportunitiesTable({ opportunities, getLead, onRemove }: Props) {
  if (opportunities.length === 0) {
    return <p className="text-sm text-gray-500">No opportunities yet.</p>
  }

  return (
    <Table>
      <Thead>
        <tr>
          <Th>Lead</Th>
          <Th>Company</Th>
          <Th>Stage</Th>
          <Th>Amount</Th>
          <Th className="text-right">Actions</Th>
        </tr>
      </Thead>
      <Tbody>
        {opportunities.map(opp => {
          const lead = getLead(opp.leadId)
          return (
            <Tr key={opp.id}>
              <Td className="font-medium">{lead?.name ?? '—'}</Td>
              <Td>{lead?.company ?? '—'}</Td>
              <Td><Badge>{opp.stage}</Badge></Td>
              <Td>{opp.amount != null ? `$${opp.amount.toLocaleString()}` : '—'}</Td>
              <Td className="text-right">
                <IconButton
                  aria-label={`Remove opportunity for ${lead?.name ?? 'unknown lead'}`}
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => onRemove(opp.id)}
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </Td>
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}
