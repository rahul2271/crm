'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'
import { StatCard, Card } from '@/components/ui'
import { formatNumber, formatPercent, formatCurrency } from '@/lib/utils'
import { Phone, TrendingUp, Users, DollarSign, Monitor, Building2, BarChart2 } from 'lucide-react'

const COLORS = ['#0d9488','#14b8a6','#2dd4bf','#5eead4','#99f6e0','#0f766e','#134e4a','#0891b2']

export default function AdminDashboard() {
  const [overview,  setOverview]  = useState<any>(null)
  const [diseases,  setDiseases]  = useState<any[]>([])
  const [trend,     setTrend]     = useState<any[]>([])
  const [consult,   setConsult]   = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)

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

  const onlineData  = consult.find((c: any) => c.consultationType === 'online')
  const hospitalData = consult.find((c: any) => c.consultationType === 'hospital')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">All-time performance across all telecallers</p>
      </div>

      {/* KPIs row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard label="Total leads given"  value={formatNumber(overview?.totalLeadsGiven ?? 0)}   sub="assigned to team"                       icon={<Phone size={18}/>}      color="teal"   />
        <StatCard label="Leads worked"       value={formatNumber(overview?.totalLeads ?? 0)}        sub="across all disease rows"                icon={<Users size={18}/>}      color="blue"   />
        <StatCard label="Converted"          value={formatNumber(overview?.totalConverted ?? 0)}    sub={`${formatPercent(overview?.conversionRate ?? 0)} conversion`} icon={<TrendingUp size={18}/>} color="green"  />
        <StatCard label="Total revenue"      value={formatCurrency(overview?.totalRevenue ?? 0)}    sub="from all conversions"                   icon={<DollarSign size={18}/>} color="purple" />
      </div>

      {/* KPIs row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Avg rev / conversion" value={formatCurrency(overview?.avgRevenuePerConversion ?? 0)} sub="per converted lead"  icon={<BarChart2 size={18}/>} color="orange" />
        <StatCard label="Active telecallers"   value={overview?.activeTelecallers ?? 0}                       sub="team members"        icon={<Users size={18}/>}    color="teal"   />
        <StatCard label="Online leads"         value={formatNumber(overview?.totalOnlineLeads ?? 0)}           sub="consultation rows"   icon={<Monitor size={18}/>}  color="blue"   />
        <StatCard label="Hospital visits"      value={formatNumber(overview?.totalHospitalLeads ?? 0)}         sub="visit rows"          icon={<Building2 size={18}/>} color="orange" />
      </div>

      {/* Consultation split */}
      {consult.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[onlineData, hospitalData].filter(Boolean).map((c: any) => (
            <div key={c.consultationType}
              className={`rounded-xl p-5 flex items-center justify-between border ${c.consultationType === 'online' ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
              <div className="flex items-center gap-4">
                <span className="text-3xl">{c.consultationType === 'online' ? '💻' : '🏥'}</span>
                <div>
                  <p className={`font-semibold ${c.consultationType === 'online' ? 'text-blue-800' : 'text-orange-800'}`}>
                    {c.consultationType === 'online' ? 'Online consultations' : 'Hospital visits'}
                  </p>
                  <p className={`text-sm ${c.consultationType === 'online' ? 'text-blue-600' : 'text-orange-600'}`}>
                    {formatNumber(c.totalLeads)} leads · {c.totalConverted} converted
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${c.consultationType === 'online' ? 'text-blue-700' : 'text-orange-700'}`}>
                  {formatCurrency(c.totalRevenue)}
                </p>
                <p className={`text-xs ${c.consultationType === 'online' ? 'text-blue-500' : 'text-orange-500'}`}>revenue</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue + leads trend */}
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
                    <Line yAxisId="l" type="monotone" dataKey="totalRevenue"   name="Revenue"    stroke="#0d9488" strokeWidth={2} dot={false} />
                    <Line yAxisId="r" type="monotone" dataKey="totalLeads"     name="Leads"      stroke="#94a3b8" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                    <Line yAxisId="r" type="monotone" dataKey="totalConverted" name="Converted"  stroke="#5eead4" strokeWidth={1.5} dot={false} />
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

      {/* Disease table with financials */}
      <Card title="Disease-wise performance & revenue">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Disease', 'Total leads', 'Converted', 'Conv. rate', 'Online', 'Hospital', 'Revenue', 'Avg / conv.'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {diseases.length === 0
                ? <tr><td colSpan={8} className="text-center py-10 text-gray-400 text-sm">No data yet</td></tr>
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
                      <td className="px-4 py-3 text-blue-600">{d.onlineLeads}</td>
                      <td className="px-4 py-3 text-orange-600">{d.hospitalLeads}</td>
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
