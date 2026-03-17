'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bot, Settings, Brain, BookOpen, Zap, LogOut,
    Save, Upload, Trash2, CheckCircle, AlertCircle,
    ChevronDown, Power, FileText, RotateCcw, Eye, EyeOff,
    Sparkles
} from 'lucide-react'

/* ─── Types ─── */
interface DocMeta { id: string; name: string; size: number; uploadedAt: string; charCount: number; pages?: number }
interface Config {
    general: { name: string; welcomeMessage: string; contactEmail: string; language: string; personality: string; enabled: boolean }
    model: { model: string; temperature: number; maxTokens: number; topP: number; frequencyPenalty: number; presencePenalty: number }
    systemPrompt: string
    knowledge: { documents: DocMeta[]; combinedText: string }
    advanced: { maxHistory: number; fallbackMessage: string; prohibitedTopics: string; responseFormat: string }
}

type TabId = 'general' | 'model' | 'prompt' | 'knowledge' | 'advanced'

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'Všeobecné', icon: <Settings size={18} /> },
    { id: 'model', label: 'AI Model', icon: <Brain size={18} /> },
    { id: 'prompt', label: 'System Prompt', icon: <Bot size={18} /> },
    { id: 'knowledge', label: 'Knowledge Base', icon: <BookOpen size={18} /> },
    { id: 'advanced', label: 'Pokročilé', icon: <Zap size={18} /> },
]

/* ─── Sub-components ─── */
function Slider({ label, value, min, max, step, onChange, description }: {
    label: string; value: number; min: number; max: number; step: number
    onChange: (v: number) => void; description?: string
}) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-white/80">{label}</label>
                <span className="text-sm font-mono text-[#D8B98A] bg-[#D8B98A]/10 px-2.5 py-0.5 rounded-lg">{value}</span>
            </div>
            <input
                type="range" min={min} max={max} step={step} value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#D8B98A]"
                style={{ background: `linear-gradient(to right, #D8B98A ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 0%)` }}
            />
            <div className="flex justify-between text-xs text-white/25">
                <span>{min}</span><span>{description}</span><span>{max}</span>
            </div>
        </div>
    )
}

function Toggle({ label, checked, onChange, description }: { label: string; checked: boolean; onChange: (v: boolean) => void; description?: string }) {
    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <div className="text-sm font-medium text-white/80">{label}</div>
                {description && <div className="text-xs text-white/35 mt-0.5">{description}</div>}
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`w-12 h-6 rounded-full transition-all duration-300 relative ${checked ? 'bg-[#D8B98A]' : 'bg-white/10'}`}
            >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${checked ? 'left-7' : 'left-1'}`} />
            </button>
        </div>
    )
}

function Select({ label, value, onChange, options }: {
    label: string; value: string; onChange: (v: string) => void
    options: { value: string; label: string }[]
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/70">{label}</label>
            <div className="relative">
                <select
                    value={value} onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#D8B98A]/50 appearance-none cursor-pointer text-sm"
                >
                    {options.map((o) => <option key={o.value} value={o.value} className="bg-[#0F1023]">{o.label}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            </div>
        </div>
    )
}

function InputField({ label, value, onChange, placeholder, type = 'text', description }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; description?: string
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/70">{label}</label>
            {description && <p className="text-xs text-white/35">{description}</p>}
            <input
                type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/25 focus:outline-none focus:border-[#D8B98A]/50 transition-colors text-sm"
            />
        </div>
    )
}

/* ─── Main Component ─── */
export default function ChatbotAdminPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<TabId>('general')
    const [config, setConfig] = useState<Config | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [uploadLoading, setUploadLoading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState<string | null>(null)
    const [showKnowledge, setShowKnowledge] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    /* Load config */
    useEffect(() => {
        fetch('/api/admin/chatbot-settings')
            .then((r) => r.json())
            .then((data) => { setConfig(data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    /* Helpers */
    const updateGeneral = (key: string, val: unknown) =>
        setConfig((c) => c ? { ...c, general: { ...c.general, [key]: val } } : c)
    const updateModel = (key: string, val: unknown) =>
        setConfig((c) => c ? { ...c, model: { ...c.model, [key]: val } } : c)
    const updateAdvanced = (key: string, val: unknown) =>
        setConfig((c) => c ? { ...c, advanced: { ...c.advanced, [key]: val } } : c)

    const handleSave = async () => {
        if (!config) return
        setSaving(true)
        setSaveStatus('idle')
        try {
            const res = await fetch('/api/admin/chatbot-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            })
            if (res.ok) {
                setSaveStatus('success')
                setTimeout(() => setSaveStatus('idle'), 3000)
            } else {
                setSaveStatus('error')
            }
        } catch {
            setSaveStatus('error')
        }
        setSaving(false)
    }

    const handlePdfUpload = useCallback(async (file: File) => {
        if (!file || file.type !== 'application/pdf') {
            setUploadStatus('❌ Nahrajte prosím PDF súbor')
            return
        }
        setUploadLoading(true)
        setUploadStatus(null)
        const formData = new FormData()
        formData.append('pdf', file)
        try {
            const res = await fetch('/api/admin/upload-pdf', { method: 'POST', body: formData })
            const data = await res.json()
            if (res.ok) {
                setUploadStatus(`✅ ${file.name} nahraný (${data.document.charCount.toLocaleString()} znakov)`)
                // Reload config to get updated knowledge
                const fresh = await fetch('/api/admin/chatbot-settings').then((r) => r.json())
                setConfig(fresh)
            } else {
                setUploadStatus(`❌ ${data.error}`)
            }
        } catch {
            setUploadStatus('❌ Chyba pri nahrávaní')
        }
        setUploadLoading(false)
    }, [])

    const handleDeleteDoc = async (docId: string) => {
        if (!confirm('Zmazať tento dokument?')) return
        const res = await fetch('/api/admin/delete-pdf', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ docId }),
        })
        if (res.ok) {
            const fresh = await fetch('/api/admin/chatbot-settings').then((r) => r.json())
            setConfig(fresh)
        }
    }

    const handleLogout = async () => {
        await fetch('/api/auth/simple-logout', { method: 'POST' })
        router.push('/admin/chatbot/login')
        router.refresh()
    }

    const formatBytes = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080B1A] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#D8B98A] animate-spin" />
            </div>
        )
    }

    if (!config) {
        return (
            <div className="min-h-screen bg-[#080B1A] flex items-center justify-center text-red-400">
                Nepodarilo sa načítať konfiguráciu.
            </div>
        )
    }

    const knowledgeTotalChars = config.knowledge?.combinedText?.length || 0

    return (
        <div className="min-h-screen bg-[#080B1A] text-white flex flex-col">
            {/* Background */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(216,185,138,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(216,185,138,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
            <div className="fixed top-0 right-0 w-[600px] h-[400px] bg-[#D8B98A]/4 rounded-full blur-[150px] pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 border-b border-white/5 bg-white/[0.02] backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D8B98A] to-[#C4A070] flex items-center justify-center">
                            <Bot size={20} className="text-[#1C1F3A]" />
                        </div>
                        <div>
                            <h1 className="font-bold text-base leading-tight">Chatbot Admin</h1>
                            <p className="text-xs text-white/30">AIWai Management Console</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Live status */}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${config.general.enabled ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${config.general.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                            {config.general.enabled ? 'Live' : 'Vypnutý'}
                        </div>

                        {/* Save button */}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D8B98A] to-[#C4A070] text-[#1C1F3A] rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                        >
                            {saving ? <Sparkles size={16} className="animate-spin" /> : saveStatus === 'success' ? <CheckCircle size={16} /> : saveStatus === 'error' ? <AlertCircle size={16} /> : <Save size={16} />}
                            {saving ? 'Ukladám...' : saveStatus === 'success' ? 'Uložené!' : saveStatus === 'error' ? 'Chyba!' : 'Uložiť'}
                        </button>

                        <button onClick={handleLogout} className="p-2 rounded-xl text-white/40 hover:text-white/80 hover:bg-white/5 transition-all" title="Odhlásiť">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Body */}
            <div className="flex-1 flex relative z-10 max-w-7xl mx-auto w-full px-6 py-8 gap-8">

                {/* Sidebar tabs */}
                <aside className="w-52 shrink-0">
                    <nav className="space-y-1 sticky top-24">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${activeTab === tab.id
                                    ? 'bg-[#D8B98A]/15 text-[#D8B98A] border border-[#D8B98A]/20'
                                    : 'text-white/45 hover:text-white/70 hover:bg-white/5'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}

                        {/* Knowledge badge */}
                        <div className="mt-6 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                            <div className="text-xs text-white/30 mb-2 uppercase tracking-widest">Knowledge Base</div>
                            <div className="text-lg font-bold text-[#D8B98A]">{config.knowledge.documents.length}</div>
                            <div className="text-xs text-white/40">dokumentov</div>
                            <div className="mt-2 h-1 rounded-full bg-white/5">
                                <div className="h-1 rounded-full bg-gradient-to-r from-[#D8B98A] to-[#C4A070]" style={{ width: `${Math.min((knowledgeTotalChars / 60000) * 100, 100)}%` }} />
                            </div>
                            <div className="text-xs text-white/25 mt-1">{(knowledgeTotalChars / 1000).toFixed(1)}k / 60k znakov</div>
                        </div>
                    </nav>
                </aside>

                {/* Content */}
                <main className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                        >

                            {/* ── GENERAL ── */}
                            {activeTab === 'general' && (
                                <div className="space-y-6">
                                    <SectionHeader title="Všeobecné nastavenia" desc="Základné nastavenia chatbota viditeľné pre používateľov" />

                                    <Card>
                                        <Toggle
                                            label="Chatbot aktívny"
                                            checked={config.general.enabled}
                                            onChange={(v) => updateGeneral('enabled', v)}
                                            description="Zapnutý/vypnutý stav chatbota na webe"
                                        />
                                        <Divider />
                                        <InputField label="Meno chatbota" value={config.general.name} onChange={(v) => updateGeneral('name', v)} placeholder="AIWai Assistant" />
                                        <InputField label="Uvítacia správa" value={config.general.welcomeMessage} onChange={(v) => updateGeneral('welcomeMessage', v)} placeholder="Hi! How can I help you?" description="Zobrazuje sa keď je chat prázdny" />
                                        <InputField label="Kontaktný email" value={config.general.contactEmail} onChange={(v) => updateGeneral('contactEmail', v)} placeholder="hello@aiwai.com" type="email" description="Na tento email odkazuje chatbot pri otázke na ceny" />
                                    </Card>

                                    <Card>
                                        <CardTitle>Jazyk a osobnosť</CardTitle>
                                        <Select
                                            label="Jazyk odpovedí"
                                            value={config.general.language}
                                            onChange={(v) => updateGeneral('language', v)}
                                            options={[
                                                { value: 'auto', label: '🌐 Automaticky (detekuje jazyk používateľa)' },
                                                { value: 'sk', label: '🇸🇰 Slovenčina' },
                                                { value: 'en', label: '🇬🇧 English' },
                                                { value: 'cs', label: '🇨🇿 Čeština' },
                                                { value: 'de', label: '🇩🇪 Deutsch' },
                                            ]}
                                        />
                                        <Select
                                            label="Osobnosť chatbota"
                                            value={config.general.personality}
                                            onChange={(v) => updateGeneral('personality', v)}
                                            options={[
                                                { value: 'professional', label: '💼 Profesionálny — formálny, stručný, vecný' },
                                                { value: 'friendly', label: '😊 Priateľský — uvoľnený, priateľský tón' },
                                                { value: 'technical', label: '🔬 Technický — detailné technické odpovede' },
                                                { value: 'sales', label: '🚀 Sales — orientovaný na konverziu' },
                                            ]}
                                        />
                                    </Card>
                                </div>
                            )}

                            {/* ── AI MODEL ── */}
                            {activeTab === 'model' && (
                                <div className="space-y-6">
                                    <SectionHeader title="AI Model nastavenia" desc="Technické parametre ovplyvňujúce správanie AI" />

                                    <Card>
                                        <CardTitle>Model</CardTitle>
                                        <Select
                                            label="OpenAI Model"
                                            value={config.model.model}
                                            onChange={(v) => updateModel('model', v)}
                                            options={[
                                                { value: 'gpt-4o', label: 'GPT-4o — Najlepší, najrýchlejší (odporúčaný)' },
                                                { value: 'gpt-4o-mini', label: 'GPT-4o Mini — Lacnejší, rýchly' },
                                                { value: 'gpt-4-turbo', label: 'GPT-4 Turbo — Silný, pomalší' },
                                                { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo — Najlacnejší' },
                                            ]}
                                        />
                                    </Card>

                                    <Card>
                                        <CardTitle>Parametre generovania</CardTitle>
                                        <div className="space-y-6">
                                            <Slider
                                                label="Temperature (kreativita)"
                                                value={config.model.temperature}
                                                min={0} max={2} step={0.1}
                                                onChange={(v) => updateModel('temperature', v)}
                                                description="nižšie = presnejšie, vyššie = kreatívnejšie"
                                            />
                                            <Slider
                                                label="Max tokens (dĺžka odpovede)"
                                                value={config.model.maxTokens}
                                                min={100} max={4000} step={100}
                                                onChange={(v) => updateModel('maxTokens', v)}
                                                description="~750 slov = 1000 tokenov"
                                            />
                                            <Slider
                                                label="Top P"
                                                value={config.model.topP}
                                                min={0} max={1} step={0.05}
                                                onChange={(v) => updateModel('topP', v)}
                                                description="nucleus sampling (0.9 = top 90% pravdepodobností)"
                                            />
                                        </div>
                                    </Card>

                                    <Card>
                                        <CardTitle>Penalizácie (pokročilé)</CardTitle>
                                        <div className="space-y-6">
                                            <Slider
                                                label="Frequency Penalty"
                                                value={config.model.frequencyPenalty}
                                                min={-2} max={2} step={0.1}
                                                onChange={(v) => updateModel('frequencyPenalty', v)}
                                                description="znižuje opakovanie rovnakých fráz"
                                            />
                                            <Slider
                                                label="Presence Penalty"
                                                value={config.model.presencePenalty}
                                                min={-2} max={2} step={0.1}
                                                onChange={(v) => updateModel('presencePenalty', v)}
                                                description="podporuje písanie o nových témach"
                                            />
                                        </div>
                                    </Card>

                                    {/* Model pricing info */}
                                    <div className="p-4 rounded-xl bg-[#D8B98A]/5 border border-[#D8B98A]/15 text-xs text-[#D8B98A]/70 leading-relaxed">
                                        💡 <strong>GPT-4o</strong> ~$0.005/1k tokenov vstup, $0.015/1k výstup · <strong>GPT-4o-mini</strong> ~$0.00015/1k vstup, $0.0006/1k výstup
                                    </div>
                                </div>
                            )}

                            {/* ── SYSTEM PROMPT ── */}
                            {activeTab === 'prompt' && (
                                <div className="space-y-6">
                                    <SectionHeader title="System Prompt" desc="Inštrukcie ktoré definujú osobnosť a správanie chatbota" />

                                    <Card>
                                        <div className="flex items-center justify-between mb-3">
                                            <CardTitle>Prompt</CardTitle>
                                            <button
                                                onClick={() => setConfig((c) => c ? { ...c, systemPrompt: `You are AIWai, an intelligent digital architect and assistant for the AIWai agency. \nThe agency specializes in:\n- AI Agents (Digital workers handling workflows 24/7)\n- AI Chatbots (Conversational interfaces)\n- Automation (Business process integration)\n- Design & Graphics (UI/UX and branding)\n\nYour tone is professional, futuristic, helpful, and concise. \nYou should help users understand how AIWai can elevate their business.\nIf asked about pricing, suggest contacting the team directly via the contact form or email ${c.general.contactEmail}.\nKeep responses brief and engaging.\nIMPORTANT: Always detect the language of the user's input and respond in exactly that same language.` } : c)}
                                                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-[#D8B98A] transition-colors"
                                            >
                                                <RotateCcw size={12} /> Reset na default
                                            </button>
                                        </div>
                                        <textarea
                                            value={config.systemPrompt}
                                            onChange={(e) => setConfig((c) => c ? { ...c, systemPrompt: e.target.value } : c)}
                                            rows={18}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white/85 text-sm font-mono leading-relaxed placeholder:text-white/25 focus:outline-none focus:border-[#D8B98A]/50 resize-none transition-colors"
                                            placeholder="You are AIWai..."
                                        />
                                        <div className="mt-2 flex justify-between text-xs text-white/25">
                                            <span>{config.systemPrompt.length} znakov</span>
                                            <span>~{Math.round(config.systemPrompt.length / 4)} tokenov</span>
                                        </div>
                                    </Card>

                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/40 leading-relaxed space-y-1">
                                        <p>💡 <strong className="text-white/60">Tips pre dobrý system prompt:</strong></p>
                                        <p>• Definuj rolu: &quot;You are X, assistant for Y company&quot;</p>
                                        <p>• Špecifikuj tón: professional / friendly / technical</p>
                                        <p>• Urči obmedzenia: &quot;Never discuss competitor prices&quot;</p>
                                        <p>• Nastav jazyk: &quot;Always respond in user&apos;s language&quot;</p>
                                        <p>• Knowledge base sa automaticky pridáva za tento prompt</p>
                                    </div>
                                </div>
                            )}

                            {/* ── KNOWLEDGE BASE ── */}
                            {activeTab === 'knowledge' && (
                                <div className="space-y-6">
                                    <SectionHeader title="Knowledge Base" desc="Nahraj PDF dokumenty — chatbot sa z nich naučí odpovedať" />

                                    {/* Upload zone */}
                                    <Card>
                                        <CardTitle>Nahrať PDF dokument</CardTitle>
                                        <div
                                            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                                            onDragLeave={() => setDragOver(false)}
                                            onDrop={(e) => {
                                                e.preventDefault(); setDragOver(false)
                                                const file = e.dataTransfer.files[0]
                                                if (file) handlePdfUpload(file)
                                            }}
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`mt-3 border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${dragOver ? 'border-[#D8B98A]/60 bg-[#D8B98A]/5' : 'border-white/10 hover:border-[#D8B98A]/30 hover:bg-white/[0.02]'}`}
                                        >
                                            <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePdfUpload(f); e.target.value = '' }} />
                                            {uploadLoading ? (
                                                <div className="flex flex-col items-center gap-3">
                                                    <Sparkles className="w-10 h-10 text-[#D8B98A] animate-spin" />
                                                    <p className="text-white/60 text-sm">Spracovávam PDF...</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-3">
                                                    <Upload size={36} className="text-white/25" />
                                                    <div>
                                                        <p className="text-white/60 text-sm font-medium">Pretiahni PDF sem alebo klikni</p>
                                                        <p className="text-white/25 text-xs mt-1">Max 15 MB · Len PDF súbory · Text musí byť selectable</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {uploadStatus && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`mt-3 p-3 rounded-xl text-sm ${uploadStatus.startsWith('✅') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                                            >
                                                {uploadStatus}
                                            </motion.div>
                                        )}
                                    </Card>

                                    {/* Documents list */}
                                    <Card>
                                        <div className="flex items-center justify-between mb-4">
                                            <CardTitle>Nahraté dokumenty ({config.knowledge.documents.length})</CardTitle>
                                            <div className="text-xs text-white/35">
                                                {(knowledgeTotalChars / 1000).toFixed(1)}k / 60k znakov
                                            </div>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="h-1.5 rounded-full bg-white/5 mb-4">
                                            <div
                                                className={`h-1.5 rounded-full transition-all ${knowledgeTotalChars > 50000 ? 'bg-orange-400' : 'bg-gradient-to-r from-[#D8B98A] to-[#C4A070]'}`}
                                                style={{ width: `${Math.min((knowledgeTotalChars / 60000) * 100, 100)}%` }}
                                            />
                                        </div>

                                        {config.knowledge.documents.length === 0 ? (
                                            <div className="text-center py-10 text-white/25">
                                                <FileText size={32} className="mx-auto mb-3 opacity-30" />
                                                <p className="text-sm">Žiadne dokumenty. Nahraj PDF vyššie.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {config.knowledge.documents.map((doc) => (
                                                    <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 group">
                                                        <FileText size={18} className="text-[#D8B98A]/60 shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-medium text-white/80 truncate">{doc.name}</div>
                                                            <div className="text-xs text-white/35 flex gap-3 mt-0.5">
                                                                <span>{formatBytes(doc.size)}</span>
                                                                {doc.pages && <span>{doc.pages} strán</span>}
                                                                <span>{(doc.charCount / 1000).toFixed(1)}k znakov</span>
                                                                <span>{new Date(doc.uploadedAt).toLocaleDateString('sk-SK')}</span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteDoc(doc.id)}
                                                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Card>

                                    {/* Preview combined knowledge */}
                                    {knowledgeTotalChars > 0 && (
                                        <Card>
                                            <button
                                                onClick={() => setShowKnowledge(!showKnowledge)}
                                                className="flex items-center justify-between w-full"
                                            >
                                                <CardTitle>Náhľad kontextu pre AI</CardTitle>
                                                {showKnowledge ? <EyeOff size={16} className="text-white/40" /> : <Eye size={16} className="text-white/40" />}
                                            </button>
                                            {showKnowledge && (
                                                <pre className="mt-3 p-4 rounded-xl bg-black/30 text-xs font-mono text-white/50 overflow-auto max-h-64 leading-relaxed border border-white/5">
                                                    {config.knowledge.combinedText.slice(0, 2000)}
                                                    {config.knowledge.combinedText.length > 2000 && '\n\n[... a ďalej ...]'}
                                                </pre>
                                            )}
                                        </Card>
                                    )}
                                </div>
                            )}

                            {/* ── ADVANCED ── */}
                            {activeTab === 'advanced' && (
                                <div className="space-y-6">
                                    <SectionHeader title="Pokročilé nastavenia" desc="Jemné doladenie správania chatbota" />

                                    <Card>
                                        <CardTitle>História konverzácie</CardTitle>
                                        <Slider
                                            label="Max správ v histórii"
                                            value={config.advanced.maxHistory}
                                            min={2} max={50} step={2}
                                            onChange={(v) => updateAdvanced('maxHistory', v)}
                                            description="Koľko posledných správ chatbot &quot;pamätá&quot;"
                                        />
                                        <p className="text-xs text-white/30 mt-2">Vyššie číslo = viac kontextu = vyššie náklady.</p>
                                    </Card>

                                    <Card>
                                        <CardTitle>Fallback správa</CardTitle>
                                        <p className="text-xs text-white/35 mb-3">Zobrazí sa keď AI zlyhá alebo nastane chyba</p>
                                        <textarea
                                            value={config.advanced.fallbackMessage}
                                            onChange={(e) => updateAdvanced('fallbackMessage', e.target.value)}
                                            rows={3}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white/80 text-sm leading-relaxed focus:outline-none focus:border-[#D8B98A]/50 resize-none"
                                        />
                                    </Card>

                                    <Card>
                                        <CardTitle>Zakázané témy</CardTitle>
                                        <p className="text-xs text-white/35 mb-3">Témy na ktoré chatbot nemá odpovedať (jedna na riadok)</p>
                                        <textarea
                                            value={config.advanced.prohibitedTopics}
                                            onChange={(e) => updateAdvanced('prohibitedTopics', e.target.value)}
                                            rows={5}
                                            placeholder="napr.&#10;Konkurencia&#10;Politika&#10;Osobné informácie"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white/80 text-sm font-mono leading-relaxed focus:outline-none focus:border-[#D8B98A]/50 resize-none placeholder:text-white/20"
                                        />
                                    </Card>

                                    <Card>
                                        <Select
                                            label="Formát odpovede"
                                            value={config.advanced.responseFormat}
                                            onChange={(v) => updateAdvanced('responseFormat', v)}
                                            options={[
                                                { value: 'plain', label: '📝 Plain text — jednoduchý text bez formátovania' },
                                                { value: 'markdown', label: '✨ Markdown — tučné písmo, zoznamy, nadpisy' },
                                            ]}
                                        />
                                    </Card>

                                    {/* Danger zone */}
                                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                                        <div className="flex items-center gap-2 text-red-400 text-sm font-bold mb-2">
                                            <Power size={16} /> Danger Zone
                                        </div>
                                        <p className="text-xs text-red-400/60 mb-3">Tieto akcie sú nevratné</p>
                                        <button
                                            onClick={() => {
                                                if (confirm('Naozaj chceš vymazať celú knowledge base?')) {
                                                    fetch('/api/admin/chatbot-settings', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ knowledge: { documents: [], combinedText: '', _docs_with_text: [] } }),
                                                    }).then(() => window.location.reload())
                                                }
                                            }}
                                            className="text-xs text-red-400 border border-red-500/30 rounded-lg px-3 py-1.5 hover:bg-red-500/10 transition-colors"
                                        >
                                            🗑 Vymazať celú Knowledge Base
                                        </button>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    )
}

/* ─── Small helper components ─── */
function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 space-y-4">
            {children}
        </div>
    )
}

function CardTitle({ children }: { children: React.ReactNode }) {
    return <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">{children}</h3>
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="mb-2">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-sm text-white/40 mt-1">{desc}</p>
        </div>
    )
}

function Divider() {
    return <div className="h-px bg-white/5 my-1" />
}
