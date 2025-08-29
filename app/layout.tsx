import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import ClientLayout from './client-layout'

export const metadata: Metadata = {
  title: 'RenThing',
  description: 'RenThing - Rent and Book in the Philippines',
  generator: 'RenThing',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
<html lang="en" suppressHydrationWarning>

      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>

      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
