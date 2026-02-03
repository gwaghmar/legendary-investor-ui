import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-20 px-4 max-w-4xl mx-auto w-full">
                <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
                <p className="mb-4">Last Updated: 2026-02-02</p>
                <p className="mb-4">
                    Legendary Investor respects your privacy. This policy explains how we handle your data.
                </p>
                <h2 className="text-xl font-bold mt-6 mb-2">1. Data Collection</h2>
                <p className="mb-4">
                    We collect the text and voice inputs you provide (portfolio symbols, share counts) solely for the purpose of generating AI analysis. This data is processed by our AI providers (OpenRouter/Anthropic) but is not sold to third parties.
                </p>
                <h2 className="text-xl font-bold mt-6 mb-2">2. Local Storage</h2>
                <p className="mb-4">
                    Your portfolio data is primarily stored in your browser's local storage or our secure database if logged in. You can clear this data at any time.
                </p>
            </main>
            <Footer />
        </div>
    );
}
