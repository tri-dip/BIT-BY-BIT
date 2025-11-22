'use client'

import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

import { cn } from '@/lib/utils'

type PopoverGroupContextValue = {
  openId: string | null
  setOpenId: (id: string | null) => void
}

const PopoverGroupContext = React.createContext<PopoverGroupContextValue | null>(null)

function PopoverGroupProvider({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = React.useState<string | null>(null)
  return <PopoverGroupContext.Provider value={{ openId, setOpenId }}>{children}</PopoverGroupContext.Provider>
}

/**
 * Popover wrapper supports an optional `popoverId` prop. When provided and wrapped
 * by `PopoverGroupProvider`, opening one popover will close others with different ids.
 */
function Popover({ popoverId, ...props }: React.ComponentProps<typeof PopoverPrimitive.Root> & { popoverId?: string }) {
  const group = React.useContext(PopoverGroupContext)

  // controlled open when part of group
  const controlledOpen = popoverId && group ? group.openId === popoverId : undefined

  const handleOpenChange = (open: boolean) => {
    if (group && popoverId) {
      if (open) {
        group.setOpenId(popoverId)
      } else if (group.openId === popoverId) {
        group.setOpenId(null)
      }
    }
    // forward event if caller provided handler
    if (props.onOpenChange) props.onOpenChange(open)
  }

  return (
    <PopoverPrimitive.Root data-slot="popover" {...props} open={controlledOpen} onOpenChange={handleOpenChange} />
  )
}

function PopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({ className, align = 'center', sideOffset = 4, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverGroupProvider }
