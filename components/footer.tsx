import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t-2 border-foreground py-6 px-4 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-foreground">2026 LEGENDARY INVESTOR</span>
                    <span className="hidden sm:inline">|</span>
                    <span>Not financial advice</span>
                </div>

                <nav className="flex items-center gap-6">
                    <Link href="/about" className="hover:text-foreground transition-colors">
                        About
                    </Link>
                    <Link href="/privacy" className="hover:text-foreground transition-colors">
                        Privacy
                    </Link>
                    <Link href="/terms" className="hover:text-foreground transition-colors">
                        Terms
                    </Link>
                </nav>

                <div className="text-xs text-muted-foreground/50">
                    Built with AI
                </div>
            </div>
        </footer>
    );
}
