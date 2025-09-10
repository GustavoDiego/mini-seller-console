import React from 'react'
import { Card, CardBody, CardHeader, Badge, Select } from './UI'
import { TrendingUp, TrendingDown } from 'lucide-react'

type SparkProps = {
  data: number[]
  stroke: string
  fill?: string
  width?: number
  height?: number
  ariaLabel: string
}

function Sparkline({ data, stroke, fill, width = 280, height = 56, ariaLabel }: SparkProps) {
  const pad = 4
  const w = width - pad * 2
  const h = height - pad * 2
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const step = w / Math.max(1, data.length - 1)

  const points = data.map((v, i) => {
    const x = pad + i * step
    const y = pad + h - ((v - min) / span) * h
    return [x, y]
  })

  const path = points.map(([x, y], i) => (i ? `L${x},${y}` : `M${x},${y}`)).join(' ')
  const area = `M${pad},${pad + h} ` + points.map(([x, y]) => `L${x},${y}`).join(' ') + ` L${pad + w},${pad + h} Z`

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-hidden"
    >
      {fill && <path d={area} fill={fill} opacity="0.15" />}
      <path d={path} fill="none" stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
    </svg>
  )
}

export default function ObservabilityPanel() {
  const leadsProcessed = [18, 22, 19, 25, 28, 26, 31, 30, 34, 33, 37, 40]
  const saveLatencyMs = [180, 172, 168, 190, 175, 162, 158, 165, 151, 149, 145, 142]
  const errorRatePct = [1.8, 1.4, 1.2, 1.6, 1.3, 1.1, 0.9, 1.0, 0.8, 0.7, 0.9, 0.8]

  const delta = (arr: number[]) => {
    const last = arr[arr.length - 1]
    const prev = arr[arr.length - 2] ?? last
    return Number((last - prev).toFixed(1))
  }

  const dLeads = delta(leadsProcessed)
  const dLatency = delta(saveLatencyMs)
  const dErrors = delta(errorRatePct)

  const Trend = ({ v }: { v: number }) =>
    v >= 0 ? (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
        <TrendingUp className="h-3.5 w-3.5" /> +{v}
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700">
        <TrendingDown className="h-3.5 w-3.5" /> {v}
      </span>
    )

  return (
    <Card>
      <CardHeader>
        <div className="flex w-full items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-base font-semibold text-gray-900">Observability</div>
            <div className="text-xs text-gray-600">System health and recent activity</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Range</span>
            <Select aria-label="Select time range" className="w-36">
              <option>Last 30 days</option>
              <option>Last 14 days</option>
              <option>Last 7 days</option>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Leads processed</span>
              <Badge><Trend v={dLeads} /></Badge>
            </div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              {leadsProcessed[leadsProcessed.length - 1]}
            </div>
            <div className="mt-2 rounded-lg bg-slate-50 p-2">
              <Sparkline
                data={leadsProcessed}
                stroke="#4f46e5"
                fill="#4f46e5"
                ariaLabel="Leads processed trend"
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Save latency (ms)</span>
              <Badge><Trend v={dLatency} /></Badge>
            </div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              {saveLatencyMs[saveLatencyMs.length - 1]}
            </div>
            <div className="mt-2 rounded-lg bg-slate-50 p-2">
              <Sparkline
                data={saveLatencyMs}
                stroke="#0ea5e9"
                fill="#0ea5e9"
                ariaLabel="Save latency trend"
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Error rate (%)</span>
              <Badge><Trend v={dErrors} /></Badge>
            </div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              {errorRatePct[errorRatePct.length - 1]}%
            </div>
            <div className="mt-2 rounded-lg bg-slate-50 p-2">
              <Sparkline
                data={errorRatePct}
                stroke="#ef4444"
                fill="#ef4444"
                ariaLabel="Error rate trend"
              />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
