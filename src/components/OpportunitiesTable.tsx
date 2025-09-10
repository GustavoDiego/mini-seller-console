import { useEffect } from 'react'
import type { Lead, Opportunity } from '../types/models'
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from './UI'
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { usePersistentState } from '../hooks/usePersistentState'

interface Props {
  opportunities: Opportunity[]
  getLead: (leadId: string) => Lead | undefined
  onRemove: (opportunityId: string) => void
}

export default function OpportunitiesTable({ opportunities, getLead, onRemove }: Props) {
  const [page, setPage] = usePersistentState<number>('opps.page', 1, v => Number(v), v => String(v))
  const [perPage, setPerPage] = usePersistentState<number>(
    'opps.perPage',
    10,
    v => Number(v),
    v => String(v)
  )

  useEffect(() => {
    setPage(1)
  }, [opportunities, setPage])

  const total = opportunities.length
  const pageCount = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(page, pageCount)
  const start = total === 0 ? 0 : (safePage - 1) * perPage + 1
  const end = total === 0 ? 0 : Math.min(safePage * perPage, total)
  const visible = opportunities.slice((safePage - 1) * perPage, safePage * perPage)

  return (
    <Card>
      <CardHeader>
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-semibold text-gray-900">Opportunities</div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page</span>
            <Select
              value={String(perPage)}
              onChange={e => {
                const v = Number(e.target.value)
                setPerPage(v)
                setPage(1)
              }}
              aria-label="Rows per page"
              className="w-28"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        {total === 0 ? (
          <p className="p-4 text-sm text-gray-500">No opportunities yet.</p>
        ) : (
          <>
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
                {visible.map(opp => {
                  const lead = getLead(opp.leadId)
                  return (
                    <Tr key={opp.id}>
                      <Td className="font-medium">{lead?.name ?? '—'}</Td>
                      <Td>{lead?.company ?? '—'}</Td>
                      <Td>
                        <Badge>{opp.stage}</Badge>
                      </Td>
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

            <div className="mt-3 flex items-center justify-between border-t pt-3">
              <div className="text-sm text-gray-600">
                Showing {start}–{end} of {total}
              </div>
              <div className="flex items-center gap-2">
                <IconButton
                  aria-label="Previous page"
                  onClick={() => setPage(Math.max(1, safePage - 1))}
                  disabled={safePage <= 1}
                  title="Previous"
                >
                  <ChevronLeft className="h-4 w-4" />
                </IconButton>
                <span className="min-w-[6ch] text-center text-sm text-gray-700">
                  {safePage} / {pageCount}
                </span>
                <IconButton
                  aria-label="Next page"
                  onClick={() => setPage(Math.min(pageCount, safePage + 1))}
                  disabled={safePage >= pageCount}
                  title="Next"
                >
                  <ChevronRight className="h-4 w-4" />
                </IconButton>
              </div>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  )
}
