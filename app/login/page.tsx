'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function LoginPage() {
    const router = useRouter()
    const supabase = createClient()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [mode, setMode] = useState<'signin' | 'signup'>('signin')

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                })
                if (error) throw error
                alert('Check your email for the confirmation link!')
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/dashboard')
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Header />

            <main className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-md border-2 border-foreground p-8 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <h1 className="text-3xl font-bold mb-2 uppercase tracking-tight text-center">
                        {mode === 'signin' ? 'Welcome Back' : 'Join the Council'}
                    </h1>
                    <p className="text-center text-muted-foreground mb-8">
                        {mode === 'signin' ? 'Sign in to access your portfolio.' : 'Create an account to save your moves.'}
                    </p>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1 uppercase">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border-2 border-foreground bg-background focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                                placeholder="legend@investor.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1 uppercase">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border-2 border-foreground bg-background focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-500 text-red-700 p-3 text-sm font-bold">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-foreground text-background py-3 font-bold uppercase tracking-wide hover:bg-foreground/90 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <button
                            onClick={() => {
                                setMode(mode === 'signin' ? 'signup' : 'signin')
                                setError(null)
                            }}
                            className="underline hover:no-underline font-medium"
                        >
                            {mode === 'signin' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
