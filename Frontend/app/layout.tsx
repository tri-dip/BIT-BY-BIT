import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const montserrat = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FocusFlow",
  description: "Created by BIT BY BIT",
  generator: "BIT by BIT",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* <CHANGE> applying Montserrat font to body */}
      <body className={`${montserrat.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
