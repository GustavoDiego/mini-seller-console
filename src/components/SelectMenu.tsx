import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from './UI'
import { ChevronDown, Check } from 'lucide-react'

type Opt<T extends string> = { value: T; label: string }

export interface SelectMenuProps<T extends string> {
  value: T
  onChange: (v: T) => void
  options: Array<Opt<T>>
  ariaLabel: string
  className?: string
  prefixIcon?: React.ReactNode
  align?: 'left' | 'right' | 'auto'
  fullWidth?: boolean
  compact?: boolean
}

function cn(...v: Array<string | undefined | false>) {
  return v.filter(Boolean).join(' ')
}

export default function SelectMenu<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  className,
  prefixIcon,
  align = 'auto',
  fullWidth = false,
  compact = false
}: SelectMenuProps<T>) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  const [menuWidth, setMenuWidth] = useState<number>(240)
  const [menuLeft, setMenuLeft] = useState<number>(0)
  const SAFE_MARGIN = 16

  const indexByValue = useMemo(
    () => new Map(options.map((o, i) => [o.value, i] as const)),
    [options]
  )
  const selectedIndex = indexByValue.get(value) ?? -1

  useEffect(() => {
    const onDocDown = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocDown)
    document.addEventListener('touchstart', onDocDown)
    return () => {
      document.removeEventListener('mousedown', onDocDown)
      document.removeEventListener('touchstart', onDocDown)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    positionMenu()
    setActiveIndex(selectedIndex)
    requestAnimationFrame(() => listRef.current?.focus())

    const onResize = () => positionMenu()
    const onScroll = () => positionMenu()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, align, selectedIndex])

  const positionMenu = () => {
    const trigger = btnRef.current
    const root = rootRef.current
    if (!trigger || !root) return

    const rootRect = root.getBoundingClientRect()
    const trigRect = trigger.getBoundingClientRect()
    const vw = window.innerWidth

    const boundaryEl = root.closest('[data-card-boundary]') as HTMLElement | null
    const boundaryRect = boundaryEl?.getBoundingClientRect() ?? ({
      left: SAFE_MARGIN,
      right: vw - SAFE_MARGIN
    } as DOMRect)

    const boundaryLeft = boundaryRect.left + SAFE_MARGIN
    const boundaryRight = boundaryRect.right - SAFE_MARGIN
    const boundaryWidth = Math.max(0, boundaryRight - boundaryLeft)

    const maxMenu = Math.min(288, Math.floor(vw * 0.9), Math.floor(boundaryWidth))
    const width = Math.max(trigRect.width, maxMenu)
    setMenuWidth(width)

    const spaceRight = boundaryRight - trigRect.left
    const spaceLeft = trigRect.right - boundaryLeft

    const prefer =
      align === 'left' || align === 'right'
        ? align
        : spaceRight >= spaceLeft
        ? 'left'
        : 'right'

    const idealLeftRelToRoot = prefer === 'left' ? 0 : trigRect.width - width
    const idealAbsLeft = rootRect.left + idealLeftRelToRoot
    const clampedAbsLeft = Math.max(boundaryLeft, Math.min(idealAbsLeft, boundaryRight - width))
    setMenuLeft(clampedAbsLeft - rootRect.left)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => {
        const next = Math.min(options.length - 1, (i < 0 ? selectedIndex : i) + 1)
        scrollIntoView(next)
        return next
      })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => {
        const next = Math.max(0, (i < 0 ? selectedIndex : i) - 1)
        scrollIntoView(next)
        return next
      })
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (activeIndex >= 0) {
        const opt = options[activeIndex]
        onChange(opt.value)
        setOpen(false)
      }
    }
  }

  const scrollIntoView = (idx: number) => {
    const el = listRef.current?.querySelector<HTMLButtonElement>(`[data-idx="${idx}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }

  const selectedLabel = options.find(o => o.value === value)?.label ?? 'Select'

  return (
    <div
      ref={rootRef}
      className={cn(
        'relative',
        fullWidth ? 'block w-full max-w-full' : 'inline-block max-w-full',
        'min-w-0',
        className
      )}
    >
      <Button
        ref={btnRef as any}
        variant="secondary"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen(o => !o)}
        className={cn(
          'h-10 w-full max-w-full min-w-0 justify-between px-3',
          compact ? 'min-w-[6rem]' : 'min-w-[8rem]'
        )}
      >
        <span className="inline-flex min-w-0 items-center gap-2 truncate">
          {prefixIcon}
          <span className="truncate">{selectedLabel}</span>
        </span>
        <ChevronDown className={cn('h-4 w-4 flex-shrink-0 transition-transform', open && 'rotate-180')} />
      </Button>

      <div
        ref={listRef}
        role="menu"
        tabIndex={-1}
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        className={cn(
          'absolute z-[95] mt-2 max-h-72 overflow-auto rounded-2xl border border-gray-200 bg-white p-1 shadow-2xl outline-none transition-all duration-150',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
        style={{ left: menuLeft, width: menuWidth }}
      >
        {options.map((opt, i) => {
          const isSelected = opt.value === value
          const isActive = i === activeIndex
          return (
            <button
              key={opt.value}
              role="menuitemradio"
              aria-checked={isSelected}
              data-idx={i}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm',
                isActive ? 'bg-indigo-50' : 'bg-transparent',
                isSelected ? 'font-medium text-gray-900' : 'text-gray-700 hover:bg-slate-50'
              )}
            >
              <span className="truncate">{opt.label}</span>
              {isSelected ? <Check className="h-4 w-4 text-indigo-600" /> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
