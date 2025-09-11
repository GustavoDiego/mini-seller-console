import { Search, Leaf } from 'lucide-react'
import { Input } from './UI'

interface Props {
  title?: string
  subtitle?: string
  searchValue?: string
  onSearchChange?: (v: string) => void
  rightSlot?: React.ReactNode
}

export default function AppBar({
  title = 'Mini Seller Console',
  subtitle = 'Leads & Opportunities',
  searchValue,
  onSearchChange,
  rightSlot
}: Props) {
  return (
    <div className="sticky top-0 z-[80] border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold text-gray-900">{title}</div>
            <div className="text-xs text-gray-600">{subtitle}</div>
          </div>
        </div>

        <div className="ml-auto flex w-full max-w-xl items-center">
          {onSearchChange ? (
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search leads globally"
                value={searchValue ?? ''}
                onChange={e => onSearchChange(e.target.value)}
                aria-label="Global search"
                className="pl-9"
              />
            </div>
          ) : null}
        </div>

        {rightSlot ? <div className="hidden md:block">{rightSlot}</div> : null}
      </div>
    </div>
  )
}

