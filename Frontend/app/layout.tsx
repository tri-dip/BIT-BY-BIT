import type React from "react"
import type { Metadata } from "next"
// <CHANGE> replaced Geist with Montserrat font
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { PopoverGroupProvider } from "@/components/ui/popover"

// <CHANGE> importing Montserrat as the main font
const montserrat = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Focus Flow",
  description: "Created by BITS BY BITS",
  generator: "BITS BY BITS",
  // icons removed to disable favicons/site icons
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
        <PopoverGroupProvider>
          {children}
          <Analytics />
        </PopoverGroupProvider>
      </body>
    </html>
  )
}
