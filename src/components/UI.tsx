import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

function cn(...v: Array<string | undefined>) {
  return v.filter(Boolean).join(' ')
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', block, ...props },
  ref
) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-600',
    secondary:
      'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus-visible:ring-indigo-600',
    ghost: 'bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-indigo-600',
  }
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-base',
  }
  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], block ? 'w-full' : '', className)}
      {...props}
    />
  )
})

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  rounded?: 'md' | 'full'
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, variant = 'ghost', size = 'md', rounded = 'md', ...props },
  ref
) {
  const base =
    'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-600',
    secondary:
      'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus-visible:ring-indigo-600',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-indigo-600',
  }
  const sizes = {
    sm: 'h-9 w-9 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-11 w-11 text-lg',
  }
  const radius = rounded === 'full' ? 'rounded-full' : 'rounded-md'
  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], radius, className)}
      {...props}
    />
  )
})

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref
) {
  const base =
    'w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600'
  const border = invalid ? 'border-red-500' : 'border-gray-300'
  return <input ref={ref} className={cn(base, border, className)} {...props} />
})

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, invalid, ...props },
  ref
) {
  const base =
    'w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600'
  const border = invalid ? 'border-red-500' : 'border-gray-300'
  return <select ref={ref} className={cn(base, border, className)} {...props} />
})

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={cn('block text-sm font-medium text-gray-700', props.className)}
    />
  )
}

export function VisuallyHidden(props: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...props}
      className={cn(
        'absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 clip-[rect(0,0,0,0)]',
        props.className
      )}
    />
  )
}

export function Field(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('space-y-1.5', props.className)} />
}

export function Badge(props: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700',
        props.className
      )}
    />
  )
}

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn('rounded-xl border border-gray-200 bg-white shadow-sm', props.className)}
    />
  )
}

export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('flex items-center justify-between p-4', props.className)} />
}

export function CardBody(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('p-4', props.className)} />
}

export function Table(props: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto">
      <table
        {...props}
        className={cn('min-w-full border-separate border-spacing-0', props.className)}
      />
    </div>
  )
}

export function Thead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} className={cn('bg-gray-50', props.className)} />
}

export function Th(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      scope="col"
      className={cn('sticky top-0 z-10 px-4 py-2 text-left text-xs font-semibold text-gray-600', props.className)}
    />
  )
}

export function Tbody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} className={cn('divide-y divide-gray-100', props.className)} />
}

export function Tr(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      {...props}
      className={cn('hover:bg-indigo-50 focus-within:bg-indigo-50 cursor-pointer', props.className)}
    />
  )
}

export function Td(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      {...props}
      className={cn('px-4 py-2 align-middle text-sm text-gray-900', props.className)}
    />
  )
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('h-4 w-4 animate-spin text-gray-600', className)} />
}
