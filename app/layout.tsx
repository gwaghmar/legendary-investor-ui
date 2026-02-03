import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: 'Legendary Investor | AI-Powered Investment Analysis',
  description: 'Watch legendary investors debate today\'s market and get AI-powered portfolio analysis from Buffett, Munger, Burry, Lynch, and Druckenmiller frameworks.',
  keywords: ['investing', 'portfolio analysis', 'Warren Buffett', 'value investing', 'stock screener'],
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} font-mono antialiased flex flex-col min-h-screen`}>
        {children}
        {/* Footer is handled per-page if unique, but we want global. 
            However, Home Page has specific structure. 
            Let's rely on pages using the Footer component if they need specific placement, 
            OR add it here. Given Home page has a wrapper, adding it here might be below the wrapper.
            Let's try adding it here for consistency. 
        */}
        {/* <Footer /> - actually, seeing page.tsx structure, it wraps everything in a div. 
            If I put Footer here, it might be outside that div. 
            Let's Import Footer and see. 
        */}
        <Analytics />
      </body>
    </html>
  )
}
