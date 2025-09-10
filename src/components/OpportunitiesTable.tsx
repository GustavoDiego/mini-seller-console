import type { Opportunity } from '../types/models'
import { Badge, Table, Tbody, Td, Th, Thead, Tr } from './UI'

interface Props {
  opportunities: Opportunity[]
}

export default function OpportunitiesTable({ opportunities }: Props) {
  if (opportunities.length === 0) {
    return <p className="text-sm text-gray-500">No opportunities yet.</p>
  }

  return (
    <Table>
      <Thead>
        <tr>
          <Th>Name</Th>
          <Th>Stage</Th>
          <Th>Amount</Th>
          <Th>Account</Th>
        </tr>
      </Thead>
      <Tbody>
        {opportunities.map(opp => (
          <Tr key={opp.id}>
            <Td className="font-medium">{opp.name}</Td>
            <Td>
              <Badge>{opp.stage}</Badge>
            </Td>
            <Td>{opp.amount ? `$${opp.amount.toLocaleString()}` : '—'}</Td>
            <Td>{opp.accountName}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}
