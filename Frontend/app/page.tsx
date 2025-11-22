"use client"

import { useState } from "react"
import MountainVistaParallax from "@/components/ui/mountain-vista-parallax"
import { Chatbot } from "@/components/chatbot"
import { AudioPlayerIcon } from "@/components/ui/audio-player-icon"
import { LiquidGlassNavbar } from "@/components/ui/liquid-glass-navbar"
import { Notifications } from "@/components/ui/notifications"
import { FocusTimerWidget } from "@/components/ui/focus-timer-widget"
import { SurveillanceNavbar } from "@/components/ui/surveillance-navbar"

export default function Home() {
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerDisplay, setTimerDisplay] = useState("")

  return (
    <main>
      <SurveillanceNavbar />
      <div className="fixed top-4 right-4 z-60">
        <Notifications />
      </div>
      <LiquidGlassNavbar />
      <MountainVistaParallax
        title="Focus Flow"
        subtitle="Discipline beats motivation - show up even when you don't want to."
      >
        {isTimerRunning && (
          <div className="text-center">
            <div
              className="text-8xl font-bold text-white font-mono"
              style={{ textShadow: "4px 4px 12px rgba(0,0,0,0.4)" }}
            >
              {timerDisplay}
            </div>
          </div>
        )}
      </MountainVistaParallax>
      <AudioPlayerIcon
        src="https://ui.webmakers.studio/audio/ncs.mp3"
        cover="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        title="NEFFEX & TOKYO MACHINE"
      />
      <FocusTimerWidget
        onTimerStateChange={(isRunning, displayTime) => {
          setIsTimerRunning(isRunning)
          setTimerDisplay(displayTime)
        }}
      />
      <Chatbot />
    </main>
  )
}
