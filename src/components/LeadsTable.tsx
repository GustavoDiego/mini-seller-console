import { useEffect } from 'react'
import type { Lead, LeadStatus } from '../types/models'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from './UI'
import { Search, Filter, ArrowUpDown, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { usePersistentState } from '../hooks/usePersistentState'

type SortDir = 'scoreDesc' | 'scoreAsc'

interface Props {
  leads: Lead[]
  loading: boolean
  error: string | null
  query: string
  setQuery: (v: string) => void
  status: LeadStatus | 'all'
  setStatus: (s: LeadStatus | 'all') => void
  sort: SortDir
  setSort: (s: SortDir) => void
  onRowClick?: (lead: Lead) => void
}

export default function LeadsTable({
  leads,
  loading,
  error,
  query,
  setQuery,
  status,
  setStatus,
  sort,
  setSort,
  onRowClick
}: Props) {
  const [page, setPage] = usePersistentState<number>('leads.page', 1, v => Number(v), v => String(v))
  const [perPage, setPerPage] = usePersistentState<number>('leads.perPage', 10, v => Number(v), v => String(v))

  useEffect(() => {
    setPage(1)
  }, [query, status, sort, setPage])

  const total = leads.length
  const pageCount = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(page, pageCount)
  const start = total === 0 ? 0 : (safePage - 1) * perPage + 1
  const end = total === 0 ? 0 : Math.min(safePage * perPage, total)
  const visible = leads.slice((safePage - 1) * perPage, safePage * perPage)

  return (
    <Card>
      <CardHeader>
        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="grid w-full grid-cols-1 gap-3 md:max-w-3xl md:grid-cols-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name or company"
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-label="Search leads"
                className="pl-9 pr-10"
              />
              {query && (
                <IconButton
                  aria-label="Clear search"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setQuery('')}
                  title="Clear"
                >
                  <X className="h-4 w-4" />
                </IconButton>
              )}
            </div>

            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Select
                value={status}
                onChange={e => setStatus(e.target.value as LeadStatus | 'all')}
                aria-label="Filter by status"
                className="appearance-none pl-9 pr-8"
              >
                <option value="all">All statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="disqualified">Disqualified</option>
              </Select>
            </div>

            <div className="relative">
              <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Select
                value={sort}
                onChange={e => setSort(e.target.value as SortDir)}
                aria-label="Sort by score"
                className="appearance-none pl-9 pr-8"
              >
                <option value="scoreDesc">Score (high → low)</option>
                <option value="scoreAsc">Score (low → high)</option>
              </Select>
            </div>
          </div>

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
              <option value="50">50</option>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        {loading && (
          <div role="status" aria-live="polite" className="p-4 text-sm text-gray-500">
            Loading leads…
          </div>
        )}

        {error && (
          <div role="alert" className="p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && total === 0 && (
          <div className="p-4 text-sm text-gray-500">No leads match your filters.</div>
        )}

        {!loading && !error && total > 0 && (
          <>
            <Table>
              <Thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Company</Th>
                  <Th>Email</Th>
                  <Th>Source</Th>
                  <Th>Score</Th>
                  <Th>Status</Th>
                </tr>
              </Thead>
              <Tbody>
                {visible.map(lead => (
                  <Tr key={lead.id} onClick={() => onRowClick?.(lead)} tabIndex={0}>
                    <Td className="font-medium">{lead.name}</Td>
                    <Td>{lead.company}</Td>
                    <Td className="text-gray-700">{lead.email}</Td>
                    <Td>{lead.source}</Td>
                    <Td>{lead.score}</Td>
                    <Td>
                      <Badge className="capitalize">{lead.status}</Badge>
                    </Td>
                  </Tr>
                ))}
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
