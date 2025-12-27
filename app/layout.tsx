import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Command Agent',
  description: 'An intelligent agent that follows your commands',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
