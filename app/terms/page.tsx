import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-20 px-4 max-w-4xl mx-auto w-full">
                <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
                <p className="mb-4">
                    By using Legendary Investor, you agree to these terms.
                </p>
                <h2 className="text-xl font-bold mt-6 mb-2">1. No Financial Advice</h2>
                <p className="mb-4">
                    **CRITICAL:** This application provides AI-generated simulations. It is NOT a financial advisor. The output should never be interpreted as a recommendation to buy or sell specific securities.
                </p>
                <h2 className="text-xl font-bold mt-6 mb-2">2. Liability</h2>
                <p className="mb-4">
                    The creators of Legendary Investor are not liable for any financial losses incurred based on the use of this tool.
                </p>
            </main>
            <Footer />
        </div>
    );
}
