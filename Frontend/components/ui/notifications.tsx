"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"

type Notification = {
  id: number
  title: string
  description?: string
  time: string
  unread?: boolean
}

const initialNotifications: Notification[] = [
  { id: 1, title: "New comment on your task", description: "Looks great — left a suggestion.", time: "15m", unread: true },
  { id: 2, title: "Review requested", description: "Please review PR #42.", time: "45m", unread: true },
  { id: 3, title: "Deployment succeeded", description: "Production build is live.", time: "4h", unread: false },
]

export function Notifications() {
  const [items, setItems] = useState<Notification[]>(initialNotifications)

  const [open, setOpen] = useState(false)
  const unreadCount = items.filter((i) => i.unread).length
  const ref = useRef<HTMLDivElement | null>(null)

  const markAllRead = () => setItems((prev) => prev.map((p) => ({ ...p, unread: false })))
  const toggleRead = (id: number) =>
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, unread: !p.unread } : p)))

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return
      if (e.target instanceof Node && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", onDocClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDocClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [])

  return (
    <div className="relative" ref={ref}>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        aria-label="Open notifications"
        onClick={() => setOpen((v) => !v)}
        className="relative"
      >
        <Bell size={18} aria-hidden="true" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 right-0 min-w-[18px] px-1 text-[10px]">{unreadCount > 99 ? "99+" : unreadCount}</Badge>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-md bg-popover p-2 shadow-md">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button type="button" className="text-xs text-muted-foreground hover:underline" onClick={markAllRead}>
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="mt-2 max-h-64 overflow-y-auto">
            {items.length === 0 && <div className="p-3 text-sm text-muted-foreground">No notifications</div>}

            {items.map((n) => (
              <div
                key={n.id}
                className={`flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 hover:bg-accent ${n.unread ? "bg-muted/30" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => toggleRead(n.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") toggleRead(n.id)
                }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-sm font-medium text-gray-800">
                  {String(n.title).charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{n.title}</div>
                  {n.description && <div className="text-xs text-muted-foreground">{n.description}</div>}
                </div>
                <div className="text-xs text-muted-foreground">{n.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
