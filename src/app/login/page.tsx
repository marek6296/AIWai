'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { login } from './actions'
import { Bot, Sparkles, ArrowRight } from 'lucide-react'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        const result = await login(formData)

        // Result will only exist if there was an error, otherwise Next.js redirects
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-brand-offwhite flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-indigo/10 p-8"
            >
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-brand-indigo flex items-center justify-center mb-4">
                        <Bot size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-brand-indigo">AIWai Admin</h1>
                    <p className="text-sm text-brand-indigo/60 mt-2">Sign in to manage your AI assistant</p>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-brand-indigo mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="admin@aiwai.sk"
                            className="w-full bg-brand-offwhite border border-brand-indigo/10 rounded-xl py-3 px-4 text-brand-indigo placeholder:text-brand-indigo/40 focus:outline-none focus:border-brand-indigo/30 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brand-indigo mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full bg-brand-offwhite border border-brand-indigo/10 rounded-xl py-3 px-4 text-brand-indigo placeholder:text-brand-indigo/40 focus:outline-none focus:border-brand-indigo/30 transition-colors"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-indigo text-white rounded-xl py-3 px-4 font-medium hover:bg-brand-indigo/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors mt-6"
                    >
                        {loading ? (
                            <Sparkles className="animate-spin" size={18} />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}
