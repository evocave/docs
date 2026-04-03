'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type LanguageContextType = {
    lang: string
    setLang: (lang: string) => void
}

const LanguageContext = createContext<LanguageContextType>({
    lang: 'en',
    setLang: () => {}
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState('en')

    useEffect(() => {
        const saved = localStorage.getItem('preferred-lang')
        if (saved) setLangState(saved)
    }, [])

    const setLang = (newLang: string) => {
        setLangState(newLang)
        localStorage.setItem('preferred-lang', newLang)
    }

    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLang() {
    return useContext(LanguageContext)
}
