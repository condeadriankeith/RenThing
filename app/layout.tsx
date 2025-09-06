import type { Metadata } from 'next'
import './globals.css'
import ClientLayout from './client-layout'

export const metadata: Metadata = {
  title: 'RenThing',
  description: 'RenThing - Rent and Book in the Philippines',
  generator: 'RenThing',
  viewport: 'width=device-width, initial-scale=1.0',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Removed duplicate font-awesome CDN link as it's already imported in globals.css */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <style>{`
          html {
            font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          }
        `}</style>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent hydration issues caused by browser extensions
              if (typeof window !== 'undefined') {
                // Remove Grammarly attributes that cause hydration mismatches
                window.addEventListener('DOMContentLoaded', function() {
                  setTimeout(function() {
                    const body = document.body;
                    if (body) {
                      body.removeAttribute('data-new-gr-c-s-check-loaded');
                      body.removeAttribute('data-gr-ext-installed');
                    }
                  }, 100);
                });
              }
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="bg-background text-foreground">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}