"use client"

import dynamic from "next/dynamic"

// Dynamically import Web3Provider to prevent SSR issues
const Web3Provider = dynamic(
  () => import("@/blockchain/providers").then((mod) => ({ default: mod.Web3Provider })),
  { ssr: false }
)

export default function RafflesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Web3Provider>{children}</Web3Provider>
}
