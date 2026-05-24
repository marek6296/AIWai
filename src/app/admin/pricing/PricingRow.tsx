'use client'

import { useState, useTransition } from 'react'
import { updatePrice, toggleActive, updateDescription } from './actions'
import { Check, Pencil, X, EyeOff, Eye } from 'lucide-react'

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
        ? `od ${priceFrom} € · do ${priceTo} €`
        : `od ${priceFrom} ${unit}`

    return (
        <div className={`rounded-xl border bg-char-soft/60 p-4 transition-all ${!isActive ? 'opacity-50 border-cream/[0.05]' : 'border-cream/[0.08] hover:border-gold/20'}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-medium text-cream">{name}</span>
                        {!isActive && (
                            <span className="rounded-md border border-cream/15 bg-cream/[0.04] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/40">
                                Vypnuté
                            </span>
                        )}
                    </div>

                    {editing ? (
                        <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2">
                                <label className="w-16 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/45">Od (€)</label>
                                <input
                                    type="number"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="w-24 rounded-md border border-cream/15 bg-cream/[0.04] px-2 py-1 text-sm text-cream focus:border-gold/40 focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="w-16 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/45">Do (€)</label>
                                <input
                                    type="number"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    placeholder="len od"
                                    className="w-24 rounded-md border border-cream/15 bg-cream/[0.04] px-2 py-1 text-sm text-cream placeholder:text-cream/30 focus:border-gold/40 focus:outline-none"
                                />
                            </div>
                            <div className="flex items-start gap-2">
                                <label className="mt-1 w-16 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/45">Popis</label>
                                <textarea
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    rows={2}
                                    className="flex-1 resize-none rounded-md border border-cream/15 bg-cream/[0.04] px-2 py-1 text-xs text-cream focus:border-gold/40 focus:outline-none"
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="text-sm font-medium text-gold tabular-nums">{priceDisplay}</div>
                            {description && <div className="mt-1 line-clamp-2 text-xs text-cream/55">{description}</div>}
                        </>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    {editing ? (
                        <>
                            <button onClick={save} disabled={isPending} className="rounded-md border border-emerald-400/40 bg-emerald-400/15 p-1.5 text-emerald-300 hover:bg-emerald-400/25 disabled:opacity-50">
                                <Check size={13} />
                            </button>
                            <button onClick={cancel} className="rounded-md border border-cream/15 bg-cream/[0.04] p-1.5 text-cream/55 hover:text-cream">
                                <X size={13} />
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setEditing(true)} className="rounded-md border border-cream/[0.08] bg-cream/[0.03] p-1.5 text-cream/55 hover:bg-cream/[0.06] hover:text-cream">
                            <Pencil size={13} />
                        </button>
                    )}
                    <button
                        onClick={toggle}
                        disabled={isPending}
                        title={isActive ? 'Skryť' : 'Zobraziť'}
                        className={`rounded-md border p-1.5 transition-colors disabled:opacity-50 ${
                            isActive
                                ? 'border-red-400/30 bg-red-400/10 text-red-300 hover:bg-red-400/15'
                                : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/15'
                        }`}
                    >
                        {isActive ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                </div>
            </div>
        </div>
    )
}
