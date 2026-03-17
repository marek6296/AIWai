'use client'

import { createContext, useState, useEffect, useRef, useCallback, type ReactNode } from 'react'
import { translations, type Lang } from './translations'

interface LanguageContextType {
    lang: Lang
    setLang: (lang: Lang) => void
    t: (key: string) => string
}

export const LanguageContext = createContext<LanguageContextType>({
    lang: 'en',
    setLang: () => {},
    t: (key: string) => key,
})

const STORAGE_KEY = 'aiwai_lang'
const FADE_DURATION = 250 // ms

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Lang>('en')
    const [mounted, setMounted] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as Lang | null
        if (stored && translations[stored]) {
            setLangState(stored)
        }
        setMounted(true)
    }, [])

    const setLang = useCallback((newLang: Lang) => {
        if (newLang === lang) return

        const wrapper = wrapperRef.current
        if (wrapper) {
            // Fade out
            wrapper.style.transition = `opacity ${FADE_DURATION}ms ease`
            wrapper.style.opacity = '0'

            setTimeout(() => {
                // Apply language change
                setLangState(newLang)
                localStorage.setItem(STORAGE_KEY, newLang)

                // Fade in after React re-renders (next frame)
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        wrapper.style.opacity = '1'
                    })
                })
            }, FADE_DURATION)
        } else {
            setLangState(newLang)
            localStorage.setItem(STORAGE_KEY, newLang)
        }
    }, [lang])

    const t = useCallback((key: string): string => {
        return translations[lang]?.[key] ?? translations['en']?.[key] ?? key
    }, [lang])

    // Avoid hydration mismatch — render English until mounted
    const contextValue: LanguageContextType = {
        lang: mounted ? lang : 'en',
        setLang,
        t: mounted ? t : (key: string) => translations['en']?.[key] ?? key,
    }

    return (
        <LanguageContext.Provider value={contextValue}>
            <div ref={wrapperRef} style={{ opacity: 1, transition: `opacity ${FADE_DURATION}ms ease` }}>
                {children}
            </div>
        </LanguageContext.Provider>
    )
}
