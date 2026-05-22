'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDate, conversionRate, formatCurrency, formatPercent } from '@/lib/utils'
import { Badge } from '@/components/ui'

interface EntryRow {
  disease: string; ageGroup: string; city: string; state: string
  consultationType: string; leadsCount: number; convertedCount: number; revenueGenerated?: number
}
interface Entry {
  _id: string; date: string; totalLeadsGiven: number; entries: EntryRow[]; notes?: string
}

export default function HistoryPage() {
  const [entries,  setEntries]  = useState<Entry[]>([])
  const [loading,  setLoading]  = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/entries')
      .then(r => r.json())
      .then(d => setEntries(d.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My history</h1>
        <p className="text-sm text-gray-500 mt-1">{entries.length} daily submissions on record</p>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-400 mb-3">No entries yet.</p>
          <Link href="/entry" className="text-sm text-brand-600 font-medium">Fill today's data →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => {
            const leads     = entry.entries.reduce((s: number, e) => s + (e.leadsCount       ?? 0), 0)
            const converted = entry.entries.reduce((s: number, e) => s + (e.convertedCount   ?? 0), 0)
            const revenue   = entry.entries.reduce((s: number, e) => s + (e.revenueGenerated ?? 0), 0)  // null-safe
            const isOpen    = expanded === entry._id

            return (
              <div key={entry._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header row */}
                <button onClick={() => setExpanded(isOpen ? null : entry._id)}
                  className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left">

                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                    <p className="text-sm font-bold text-brand-700">{entry.date.slice(8)}</p>
                    <p className="text-xs text-brand-500">{new Date(entry.date + 'T00:00:00').toLocaleString('en', { month: 'short' })}</p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{formatDate(entry.date + 'T00:00:00')}</p>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {entry.entries.length} rows · {leads} leads worked · {converted} converted
                    </p>
                  </div>

                  <div className="hidden md:flex items-center gap-5 flex-shrink-0 text-right">
                    <div>
                      <p className="text-xs text-gray-400">Given</p>
                      <p className="font-bold text-gray-800">{entry.totalLeadsGiven}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Conv. rate</p>
                      <p className={`font-bold ${conversionRate(converted, leads) >= 50 ? 'text-green-600' : 'text-gray-600'}`}>
                        {formatPercent(conversionRate(converted, leads))}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Revenue</p>
                      <p className="font-bold text-brand-700">{formatCurrency(revenue)}</p>
                    </div>
                  </div>

                  <span className="text-gray-400 flex-shrink-0">{isOpen ? '▲' : '▼'}</span>
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="border-t border-gray-100 overflow-x-auto">
                    <table className="w-full text-sm min-w-[720px]">
                      <thead>
                        <tr className="bg-gray-50">
                          {['Disease', 'Age', 'City', 'State', 'Type', 'Leads', 'Converted', 'Rate', 'Revenue'].map(h => (
                            <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-2.5">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {entry.entries.map((row, i) => (
                          <tr key={i} className="border-t border-gray-50 hover:bg-gray-50">
                            <td className="px-4 py-2.5 font-medium text-gray-800">{row.disease}</td>
                            <td className="px-4 py-2.5 text-gray-600">{row.ageGroup} yrs</td>
                            <td className="px-4 py-2.5 text-gray-600">{row.city}</td>
                            <td className="px-4 py-2.5 text-gray-600">{row.state}</td>
                            <td className="px-4 py-2.5">
                              <Badge color={row.consultationType === 'online' ? 'blue' : 'yellow'}>
                                {row.consultationType === 'online' ? '💻 Online' : '🏥 Visit'}
                              </Badge>
                            </td>
                            <td className="px-4 py-2.5 font-semibold text-gray-800">{row.leadsCount}</td>
                            <td className="px-4 py-2.5 text-green-600 font-semibold">{row.convertedCount}</td>
                            <td className="px-4 py-2.5 text-xs font-semibold text-gray-500">
                              {formatPercent(conversionRate(row.convertedCount, row.leadsCount))}
                            </td>
                            <td className="px-4 py-2.5 font-semibold text-brand-700">
                              {formatCurrency(row.revenueGenerated ?? 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {/* Day total footer */}
                      <tfoot>
                        <tr className="border-t-2 border-gray-200 bg-gray-50">
                          <td colSpan={5} className="px-4 py-2.5 text-xs font-bold text-gray-600 uppercase">Day total</td>
                          <td className="px-4 py-2.5 font-bold text-gray-900">{leads}</td>
                          <td className="px-4 py-2.5 font-bold text-green-600">{converted}</td>
                          <td className="px-4 py-2.5 font-bold text-gray-500">{formatPercent(conversionRate(converted, leads))}</td>
                          <td className="px-4 py-2.5 font-bold text-brand-700">{formatCurrency(revenue)}</td>
                        </tr>
                      </tfoot>
                    </table>
                    {entry.notes && (
                      <div className="px-5 py-3 border-t border-gray-50 bg-gray-50 text-xs text-gray-500">
                        📝 {entry.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
