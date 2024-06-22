'use client'

import clsx from "clsx";

import EmptyState      from "@/app/components/EmptyState"
import useConversation from "@/app/hooks/useConversation";

export default function Home() {
  const {isOpen} = useConversation();
  return (
    <div className={
      clsx("lg:pl-80 h-full lg:block",
        isOpen? 'block': 'hidden'
      )
    }>
      <EmptyState />
    </div>
  )
}