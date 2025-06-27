import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/hooks/use-auth'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'Travel Itinerary Planner',
  description: 'Plan your perfect trip with our comprehensive itinerary planner',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
