import { useEffect, useMemo, useState } from 'react'
import type { Lead, LeadStatus } from '../types/models'

interface Options {
  initialSort?: 'scoreDesc' | 'scoreAsc'
}

export function useLeads({ initialSort = 'scoreDesc' }: Options = {}) {
  const [raw, setRaw] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<LeadStatus | 'all'>('all')
  const [sort, setSort] = useState<'scoreDesc' | 'scoreAsc'>(initialSort)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    const timer = setTimeout(async () => {
      try {
        const mod = await import('../assets/leads.json')
        if (!active) return
        setRaw(mod.default as Lead[])
      } catch (e) {
        if (!active) return
        setError('Failed to load leads')
      } finally {
        if (active) setLoading(false)
      }
    }, 500)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let items = raw
    if (q) {
      items = items.filter(
        l =>
          l.name.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q)
      )
    }
    if (status !== 'all') items = items.filter(l => l.status === status)
    items = [...items].sort((a, b) =>
      sort === 'scoreDesc' ? b.score - a.score : a.score - b.score
    )
    return items
  }, [raw, query, status, sort])

  return {
    loading,
    error,
    leads: filtered,
    query,
    setQuery,
    status,
    setStatus,
    sort,
    setSort
  }
}
