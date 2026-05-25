'use client'
import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { StatCard, Card } from '@/components/ui'
import { formatNumber, formatPercent, formatCurrency } from '@/lib/utils'
import { CONSULT_OPTIONS } from '@/types'
import { Phone, TrendingUp, Users, DollarSign, BarChart2 } from 'lucide-react'

const COLORS = ['#0d9488','#14b8a6','#2dd4bf','#5eead4','#99f6e0','#0f766e','#134e4a','#0891b2']

export default function AdminDashboard() {
  const [overview, setOverview] = useState<any>(null)
  const [diseases, setDiseases] = useState<any[]>([])
  const [trend,    setTrend]    = useState<any[]>([])
  const [consult,  setConsult]  = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const last30 = new Date(); last30.setDate(last30.getDate() - 30)
    const df = last30.toISOString().split('T')[0]
    Promise.all([
      fetch('/api/analytics?type=overview').then(r => r.json()),
      fetch('/api/analytics?type=disease').then(r => r.json()),
      fetch(`/api/analytics?type=trend&dateFrom=${df}`).then(r => r.json()),
      fetch('/api/analytics?type=consultationType').then(r => r.json()),
    ]).then(([ov, dis, tr, ct]) => {
      setOverview(ov.data)
      setDiseases((dis.data ?? []).slice(0, 8))
      setTrend(tr.data ?? [])
      setConsult(ct.data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">All-time performance across all telecallers</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard label="Total leads given" value={formatNumber(overview?.totalLeadsGiven ?? 0)} sub="assigned to team"       icon={<Phone size={18}/>}      color="teal"   />
        <StatCard label="Leads worked"      value={formatNumber(overview?.totalLeads ?? 0)}      sub="across all rows"        icon={<Users size={18}/>}      color="blue"   />
        <StatCard label="Converted"         value={formatNumber(overview?.totalConverted ?? 0)}  sub={`${formatPercent(overview?.conversionRate ?? 0)} rate`} icon={<TrendingUp size={18}/>} color="green" />
        <StatCard label="Total revenue"     value={formatCurrency(overview?.totalRevenue ?? 0)}  sub="from all conversions"   icon={<DollarSign size={18}/>} color="purple" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Avg rev / conv"    value={formatCurrency(overview?.avgRevenuePerConversion ?? 0)} sub="per converted lead" icon={<BarChart2 size={18}/>} color="orange" />
        <StatCard label="Active telecallers" value={overview?.activeTelecallers ?? 0}                       sub="team members"       icon={<Users size={18}/>}    color="teal"   />
      </div>

      {/* ── Consultation type split — all 4 types ── */}
      {consult.length > 0 && (
        <div className={`grid gap-4 mb-6 ${consult.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
          {consult.map((c: any) => {
            const opt = CONSULT_OPTIONS.find(o => o.value === c.consultationType)
            // Derive Tailwind classes from opt.color (bg-xxx-100 text-xxx-700)
            const bgBorder = opt?.value === 'online'   ? 'bg-blue-50 border-blue-100'
                           : opt?.value === 'hospital' ? 'bg-orange-50 border-orange-100'
                           : opt?.value === 'whatsapp' ? 'bg-green-50 border-green-100'
                           : 'bg-purple-50 border-purple-100'
            const textTitle = opt?.value === 'online'   ? 'text-blue-800'
                            : opt?.value === 'hospital' ? 'text-orange-800'
                            : opt?.value === 'whatsapp' ? 'text-green-800'
                            : 'text-purple-800'
            const textSub = opt?.value === 'online'   ? 'text-blue-600'
                          : opt?.value === 'hospital' ? 'text-orange-600'
                          : opt?.value === 'whatsapp' ? 'text-green-600'
                          : 'text-purple-600'
            const textRev = opt?.value === 'online'   ? 'text-blue-700'
                          : opt?.value === 'hospital' ? 'text-orange-700'
                          : opt?.value === 'whatsapp' ? 'text-green-700'
                          : 'text-purple-700'
            return (
              <div key={c.consultationType} className={`rounded-xl p-4 flex items-center justify-between border ${bgBorder}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{opt?.icon ?? '📋'}</span>
                  <div>
                    <p className={`font-semibold text-sm ${textTitle}`}>{opt?.label ?? c.consultationType}</p>
                    <p className={`text-xs mt-0.5 ${textSub}`}>
                      {formatNumber(c.totalLeads)} leads · {c.totalConverted} converted
                    </p>
                  </div>
                </div>
                <p className={`text-xl font-bold ${textRev}`}>{formatCurrency(c.totalRevenue)}</p>
              </div>
            )
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue trend */}
        <Card title="Revenue & leads — last 30 days">
          <div className="p-4">
            {trend.length === 0
              ? <div className="h-52 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
              : <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={trend} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={d => d.slice(5)} />
                    <YAxis yAxisId="l" tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                    <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #f0f0f0' }}
                      formatter={(v: any, name: string) => [name === 'Revenue' ? formatCurrency(v) : v, name]} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line yAxisId="l" type="monotone" dataKey="totalRevenue"   name="Revenue"   stroke="#0d9488" strokeWidth={2} dot={false} />
                    <Line yAxisId="r" type="monotone" dataKey="totalLeads"     name="Leads"     stroke="#94a3b8" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                    <Line yAxisId="r" type="monotone" dataKey="totalConverted" name="Converted" stroke="#5eead4" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
            }
          </div>
        </Card>

        {/* Disease pie */}
        <Card title="Disease distribution" subtitle="By lead volume">
          <div className="p-4">
            {diseases.length === 0
              ? <div className="h-52 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
              : <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={diseases} dataKey="totalLeads" nameKey="disease" cx="50%" cy="50%" outerRadius={80}
                      label={({ disease, percent }: any) => `${disease.split(' ')[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {diseases.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }}
                      formatter={(v: any, _: any, props: any) => [`${v} leads · ${formatCurrency(props.payload.totalRevenue)}`, props.payload.disease]} />
                  </PieChart>
                </ResponsiveContainer>
            }
          </div>
        </Card>
      </div>

      {/* Disease table */}
      <Card title="Disease-wise performance & revenue">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Disease', 'Total leads', 'Converted', 'Conv. rate', 'Revenue', 'Avg / conv.'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {diseases.length === 0
                ? <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-sm">No data yet</td></tr>
                : diseases.map((d: any) => (
                    <tr key={d.disease} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{d.disease}</td>
                      <td className="px-4 py-3 text-gray-600">{formatNumber(d.totalLeads)}</td>
                      <td className="px-4 py-3 text-gray-600">{formatNumber(d.totalConverted)}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${d.conversionRate >= 50 ? 'text-green-600' : d.conversionRate >= 25 ? 'text-yellow-600' : 'text-red-500'}`}>
                          {formatPercent(d.conversionRate)}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-brand-700">{formatCurrency(d.totalRevenue)}</td>
                      <td className="px-4 py-3 text-gray-500">{formatCurrency(d.avgRevenue)}</td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
