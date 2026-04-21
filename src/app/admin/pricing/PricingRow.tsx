'use client'

import { useState, useTransition } from 'react'
import { updatePrice, toggleActive, updateDescription } from './actions'
import { Check, Pencil, X } from 'lucide-react'

interface Props {
    id: string
    name: string
    priceFrom: number
    priceTo: number | null
    unit: string
    description: string | null
    isActive: boolean
}

export default function PricingRowEditor({ id, name, priceFrom, priceTo, unit, description, isActive }: Props) {
    const [editing, setEditing] = useState(false)
    const [from, setFrom] = useState(String(priceFrom))
    const [to, setTo] = useState(priceTo ? String(priceTo) : '')
    const [desc, setDesc] = useState(description ?? '')
    const [isPending, startTransition] = useTransition()

    const save = () => {
        startTransition(async () => {
            await updatePrice(id, Number(from) || priceFrom, to ? Number(to) : null)
            await updateDescription(id, desc)
            setEditing(false)
        })
    }

    const cancel = () => {
        setFrom(String(priceFrom))
        setTo(priceTo ? String(priceTo) : '')
        setDesc(description ?? '')
        setEditing(false)
    }

    const toggle = () => {
        startTransition(async () => {
            await toggleActive(id, !isActive)
        })
    }

    const priceDisplay = unit === 'dohodou'
        ? 'dohodou'
        : priceTo
        ? `od ${priceFrom} € do ${priceTo} €`
        : `od ${priceFrom} ${unit}`

    return (
        <div className={`bg-white rounded-xl border p-4 transition-opacity ${!isActive ? 'opacity-50' : 'border-brand-indigo/10'}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-brand-indigo text-sm">{name}</span>
                        {!isActive && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">Vypnuté</span>}
                    </div>

                    {editing ? (
                        <div className="space-y-2 mt-2">
                            <div className="flex items-center gap-2">
                                <label className="text-xs text-brand-indigo/50 w-16">Od (€)</label>
                                <input
                                    type="number"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="w-24 border border-brand-indigo/20 rounded-lg px-2 py-1 text-sm text-brand-indigo"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-xs text-brand-indigo/50 w-16">Do (€)</label>
                                <input
                                    type="number"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    placeholder="prázdne = len od"
                                    className="w-24 border border-brand-indigo/20 rounded-lg px-2 py-1 text-sm text-brand-indigo"
                                />
                            </div>
                            <div className="flex items-start gap-2">
                                <label className="text-xs text-brand-indigo/50 w-16 mt-1">Popis</label>
                                <textarea
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    rows={2}
                                    className="flex-1 border border-brand-indigo/20 rounded-lg px-2 py-1 text-xs text-brand-indigo resize-none"
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="text-sm font-medium text-emerald-600">{priceDisplay}</div>
                            {description && <div className="text-xs text-brand-indigo/50 mt-1 line-clamp-2">{description}</div>}
                        </>
                    )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    {editing ? (
                        <>
                            <button onClick={save} disabled={isPending} className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50">
                                <Check size={13} />
                            </button>
                            <button onClick={cancel} className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200">
                                <X size={13} />
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg bg-brand-indigo/5 text-brand-indigo/60 hover:bg-brand-indigo/10">
                            <Pencil size={13} />
                        </button>
                    )}
                    <button
                        onClick={toggle}
                        disabled={isPending}
                        className={`text-xs px-2 py-1 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                            isActive
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                    >
                        {isActive ? 'Skryť' : 'Zobraziť'}
                    </button>
                </div>
            </div>
        </div>
    )
}
