import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Mail, Facebook, Instagram } from 'lucide-react'
import ClientRow from './components/ClientRow'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const supabase = createClient()
    const source = typeof searchParams.source === 'string' ? searchParams.source : 'all'

    let query = supabase
        .from('clients')
        .select('*')
        .order('last_message_at', { ascending: false })

    if (source !== 'all') {
        query = query.eq('source', source)
    }

    const { data: clients, error } = await query

    if (error) {
        return <div className="p-8 text-red-600 bg-red-50 rounded-2xl border border-red-100">Error loading clients: {error.message}</div>
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-brand-indigo mb-2">Leads Overview</h1>
                    <p className="text-brand-indigo/60">Manage your active AI conversations and clients.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-brand-indigo/10 px-6 py-4 flex gap-8">
                    <div>
                        <div className="text-sm font-medium text-brand-indigo/50 mb-1">Total Leads</div>
                        <div className="text-2xl font-bold text-brand-indigo">{clients?.length}</div>
                    </div>
                    <div className="w-px bg-brand-indigo/10" />
                    <div>
                        <div className="text-sm font-medium text-brand-indigo/50 mb-1">Active Bots</div>
                        <div className="text-2xl font-bold text-brand-indigo">{clients?.filter(c => c.bot_active).length}</div>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 pb-4 overflow-x-auto">
                <Link
                    href="/admin"
                    className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-colors ${source === 'all'
                        ? 'bg-brand-indigo text-white'
                        : 'bg-white border border-brand-indigo/10 text-brand-indigo/70 hover:bg-brand-indigo/5'
                        }`}
                >
                    All Leads
                </Link>
                <Link
                    href="/admin?source=gmail"
                    className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${source === 'gmail'
                        ? 'bg-brand-indigo text-white shadow-sm'
                        : 'bg-white border border-brand-indigo/10 text-brand-indigo/70 hover:bg-brand-indigo/5'
                        }`}
                >
                    <Mail size={16} />
                    Gmail
                </Link>
                <div className="relative group flex items-center">
                    <button disabled className="px-5 py-2.5 rounded-full bg-white/50 border border-brand-indigo/5 text-brand-indigo/40 text-sm font-medium whitespace-nowrap cursor-not-allowed flex items-center gap-2">
                        <Facebook size={16} />
                        Facebook Page
                    </button>
                    <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm pointer-events-none">
                        SOON
                    </span>
                </div>
                <div className="relative group flex items-center">
                    <button disabled className="px-5 py-2.5 rounded-full bg-white/50 border border-brand-indigo/5 text-brand-indigo/40 text-sm font-medium whitespace-nowrap cursor-not-allowed flex items-center gap-2">
                        <Instagram size={16} />
                        Instagram
                    </button>
                    <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm pointer-events-none">
                        SOON
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-brand-indigo/5 border border-brand-indigo/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-brand-indigo/5 border-b border-brand-indigo/10 text-brand-indigo/70 text-sm font-medium uppercase tracking-wider">
                                <th className="p-4 pl-6">Client Email</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">AI Assistant</th>
                                <th className="p-4">Last Activity</th>
                                <th className="p-4 pr-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-indigo/5">
                            {clients?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-brand-indigo/50">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <Mail size={32} className="opacity-40" />
                                            <p>No clients found. Waiting for new emails.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {clients?.map((client) => (
                                <ClientRow key={client.id} client={client} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
