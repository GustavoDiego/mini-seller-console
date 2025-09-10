import { useEffect, useRef, useState } from 'react'

type Parser<T> = (raw: string) => T
type Serializer<T> = (value: T) => string

export function usePersistentState<T>(
  key: string,
  initialValue: T,
  parse: Parser<T> = JSON.parse,
  serialize: Serializer<T> = JSON.stringify
) {
  const isFirst = useRef(true)
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw == null) return initialValue
      return parse(raw)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    try {
      localStorage.setItem(key, serialize(state))
    } catch {
      /* ignore */
    }
  }, [key, state, serialize])

  return [state, setState] as const
}
