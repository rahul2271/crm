'use client'
import { useEffect, useState } from 'react'
import { format, subDays } from 'date-fns'
import { Card, Badge } from '@/components/ui'
import { formatDate, conversionRate, formatPercent } from '@/lib/utils'

export default function AdminReportsPage() {
  const [telecallers, setTelecallers] = useState<any[]>([])
  const [selectedTc,  setSelectedTc]  = useState('')
  const [dateFrom,    setDateFrom]    = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'))
  const [dateTo,      setDateTo]      = useState(format(new Date(), 'yyyy-MM-dd'))
  const [entries,     setEntries]     = useState<any[]>([])
  const [loading,     setLoading]     = useState(false)
  const [expanded,    setExpanded]    = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/telecallers').then(r => r.json()).then(d => {
      const tcs = d.data ?? []
      setTelecallers(tcs)
      if (tcs.length) setSelectedTc(tcs[0]._id)
    })
  }, [])

  function fetchEntries() {
    if (!selectedTc) return
    setLoading(true)
    const qs = new URLSearchParams({ telecallerId: selectedTc, dateFrom, dateTo })
    fetch(`/api/entries?${qs}`)
      .then(r => r.json())
      .then(d => setEntries(d.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { if (selectedTc) fetchEntries() }, [selectedTc, dateFrom, dateTo]) // eslint-disable-line

  const selectedName = telecallers.find(t => t._id === selectedTc)?.name ?? ''

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Daily reports</h1>
        <p className="text-sm text-gray-500 mt-1">View a telecaller's day-by-day submissions</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1.5">Telecaller</label>
            <select value={selectedTc} onChange={e => setSelectedTc(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
              {telecallers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1.5">From</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1.5">To</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          {/* Quick ranges */}
          <div className="flex gap-1.5 flex-wrap">
            {[
              { label: 'Last 7d',  from: format(subDays(new Date(), 7), 'yyyy-MM-dd'),  to: format(new Date(), 'yyyy-MM-dd') },
              { label: 'Last 30d', from: format(subDays(new Date(), 30), 'yyyy-MM-dd'), to: format(new Date(), 'yyyy-MM-dd') },
              { label: 'This month', from: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'), to: format(new Date(), 'yyyy-MM-dd') },
            ].map(r => (
              <button key={r.label} onClick={() => { setDateFrom(r.from); setDateTo(r.to) }}
                className={`text-xs px-2.5 py-1.5 rounded-lg transition-all ${dateFrom === r.from && dateTo === r.to ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary strip */}
      {entries.length > 0 && (() => {
        const totalGiven     = entries.reduce((s: number, e) => s + e.totalLeadsGiven, 0)
        const totalLeads     = entries.reduce((s: number, e: any) => s + e.entries.reduce((a: number, r: any) => a + r.leadsCount, 0), 0)
        const totalConverted = entries.reduce((s: number, e: any) => s + e.entries.reduce((a: number, r: any) => a + r.convertedCount, 0), 0)
        return (
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Days submitted', value: entries.length },
              { label: 'Total leads given', value: totalGiven },
              { label: 'Leads worked', value: totalLeads },
              { label: `Converted (${formatPercent(conversionRate(totalConverted, totalLeads))})`, value: totalConverted },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )
      })()}

      {/* Entry list */}
      {loading
        ? <div className="flex justify-center py-16"><div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full" /></div>
        : entries.length === 0
          ? <div className="text-center py-16 bg-white rounded-xl border border-gray-100 text-gray-400 text-sm">No submissions for this period.</div>
          : (
            <div className="space-y-3">
              {entries.map((entry: any) => {
                const leads     = entry.entries.reduce((s: number, r: any) => s + r.leadsCount, 0)
                const converted = entry.entries.reduce((s: number, r: any) => s + r.convertedCount, 0)
                const isOpen    = expanded === entry._id
                return (
                  <div key={entry._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <button onClick={() => setExpanded(isOpen ? null : entry._id)}
                      className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50 text-left transition-colors">
                      <div className="w-12 h-12 bg-brand-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                        <p className="text-sm font-bold text-brand-700">{entry.date.slice(8)}</p>
                        <p className="text-xs text-brand-500">{new Date(entry.date).toLocaleString('en', { month: 'short' })}</p>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{formatDate(entry.date)}</p>
                        <p className="text-sm text-gray-400 mt-0.5">{entry.entries.length} disease rows · {leads} leads worked · {converted} converted</p>
                      </div>
                      <div className="hidden md:flex gap-6 text-right flex-shrink-0">
                        <div><p className="text-xs text-gray-400">Given</p><p className="font-bold text-gray-800">{entry.totalLeadsGiven}</p></div>
                        <div><p className="text-xs text-gray-400">Converted</p><p className={`font-bold ${converted > 0 ? 'text-green-600' : 'text-gray-400'}`}>{converted}</p></div>
                        <div><p className="text-xs text-gray-400">Rate</p><p className={`font-bold text-sm ${conversionRate(converted, leads) >= 50 ? 'text-green-600' : 'text-gray-600'}`}>{formatPercent(conversionRate(converted, leads))}</p></div>
                      </div>
                      <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
                    </button>
                    {isOpen && (
                      <div className="border-t border-gray-100 overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50">
                              {['Disease', 'Age', 'City', 'State', 'Type', 'Leads', 'Converted', 'Rate'].map(h => (
                                <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-2.5">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {entry.entries.map((row: any, i: number) => (
                              <tr key={i} className="border-t border-gray-50 hover:bg-gray-50">
                                <td className="px-4 py-2.5 font-medium text-gray-800">{row.disease}</td>
                                <td className="px-4 py-2.5 text-gray-600">{row.ageGroup}</td>
                                <td className="px-4 py-2.5 text-gray-600">{row.city}</td>
                                <td className="px-4 py-2.5 text-gray-600">{row.state}</td>
                                <td className="px-4 py-2.5">
                                  <Badge color={row.consultationType === 'online' ? 'blue' : 'yellow'}>
                                    {row.consultationType === 'online' ? '💻 Online' : '🏥 Visit'}
                                  </Badge>
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-gray-800">{row.leadsCount}</td>
                                <td className="px-4 py-2.5 text-green-600 font-semibold">{row.convertedCount}</td>
                                <td className="px-4 py-2.5">
                                  <span className={`text-xs font-semibold ${conversionRate(row.convertedCount, row.leadsCount) >= 50 ? 'text-green-600' : 'text-gray-500'}`}>
                                    {formatPercent(conversionRate(row.convertedCount, row.leadsCount))}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {entry.notes && (
                          <div className="px-5 py-3 border-t border-gray-50 bg-gray-50 text-xs text-gray-500">📝 {entry.notes}</div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
      }
    </div>
  )
}
