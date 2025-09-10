import { useEffect, useMemo, useState } from 'react'
import type { Lead, LeadStatus } from '../types/models'
import { usePersistentState } from './usePersistentState'

interface Options {
  initialSort?: 'scoreDesc' | 'scoreAsc'
}

export function useLeads({ initialSort = 'scoreDesc' }: Options = {}) {
  const [raw, setRaw] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = usePersistentState<string>('leads.query', '')
  const [status, setStatus] = usePersistentState<LeadStatus | 'all'>('leads.status', 'all')
  const [sort, setSort] = usePersistentState<'scoreDesc' | 'scoreAsc'>('leads.sort', initialSort)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    const timer = setTimeout(async () => {
      try {
        const mod = await import('../assets/leads.json')
        if (!active) return
        setRaw(mod.default as Lead[])
      } catch {
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

  const leads = useMemo(() => {
    const q = query.trim().toLowerCase()
    let items = raw
    if (q) {
      items = items.filter(l => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q))
    }
    if (status !== 'all') items = items.filter(l => l.status === status)
    items = [...items].sort((a, b) => (sort === 'scoreDesc' ? b.score - a.score : a.score - b.score))
    return items
  }, [raw, query, status, sort])

  const updateLead = async (updated: Lead) => {
    const snapshot = raw
    const next = raw.map(l => (l.id === updated.id ? updated : l))
    setRaw(next)
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() < 0.9 ? resolve(true) : reject(new Error('Failed to save'))
        }, 600)
      })
    } catch (e) {
      setRaw(snapshot)
      throw e
    }
  }

  const getById = (id: string) => raw.find(l => l.id === id)

  return {
    loading,
    error,
    leads,
    query,
    setQuery,
    status,
    setStatus,
    sort,
    setSort,
    updateLead,
    getById
  }
}
