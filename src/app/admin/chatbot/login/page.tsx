'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bot, Lock, User, ArrowRight, Sparkles } from 'lucide-react'

export default function ChatbotAdminLogin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/auth/simple-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Prihlásenie zlyhalo')
                setLoading(false)
                return
            }

            router.push('/admin/chatbot')
            router.refresh()
        } catch {
            setError('Chyba siete. Skúste znovu.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#080B1A] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(216,185,138,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(216,185,138,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

            {/* Glow orbs */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#D8B98A]/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#1C1F3A]/30 blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
                className="w-full max-w-md relative z-10"
            >
                {/* Card */}
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">

                    {/* Logo */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D8B98A] to-[#C4A070] flex items-center justify-center mb-5 shadow-lg shadow-[#D8B98A]/20">
                            <Bot size={30} className="text-[#1C1F3A]" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1">Chatbot Admin</h1>
                        <p className="text-white/40 text-sm">AIWai · Intelligent Architecture</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="username"
                                    autoComplete="username"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/25 focus:outline-none focus:border-[#D8B98A]/50 focus:bg-white/8 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-2">
                                Heslo
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/25 focus:outline-none focus:border-[#D8B98A]/50 focus:bg-white/8 transition-all text-sm"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 bg-gradient-to-r from-[#D8B98A] to-[#C4A070] text-[#1C1F3A] rounded-xl py-3.5 px-4 font-bold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity shadow-lg shadow-[#D8B98A]/20"
                        >
                            {loading ? (
                                <Sparkles className="animate-spin" size={18} />
                            ) : (
                                <>
                                    Prihlásiť sa
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-white/20 text-xs mt-6">
                    AIWai · Chatbot Management Console
                </p>
            </motion.div>
        </div>
    )
}
