import type { Lead, LeadStatus } from '../types/models'
import { Badge, Field, IconButton, Input, Label, Select, Table, Tbody, Td, Th, Thead, Tr } from './UI'
import { Search, Filter, ArrowUpDown, X } from 'lucide-react'

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
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Field>
          <Label htmlFor="lead-search">Search</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="lead-search"
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
        </Field>

        <Field>
          <Label htmlFor="lead-status">Status</Label>
          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Select
              id="lead-status"
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
        </Field>

        <Field>
          <Label htmlFor="lead-sort">Sort</Label>
          <div className="relative">
            <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Select
              id="lead-sort"
              value={sort}
              onChange={e => setSort(e.target.value as SortDir)}
              aria-label="Sort by score"
              className="appearance-none pl-9 pr-8"
            >
              <option value="scoreDesc">Score (high → low)</option>
              <option value="scoreAsc">Score (low → high)</option>
            </Select>
          </div>
        </Field>
      </div>

      {loading && (
        <div role="status" aria-live="polite" className="text-sm text-gray-500">
          Loading leads…
        </div>
      )}

      {error && (
        <div role="alert" className="text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && leads.length === 0 && (
        <div className="text-sm text-gray-500">No leads match your filters.</div>
      )}

      {!loading && !error && leads.length > 0 && (
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
            {leads.map(lead => (
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
      )}
    </div>
  )
}
