"use client"

import { useEffect } from "react"

export function ErrorHandler() {
  useEffect(() => {
    // Only suppress errors in production
    if (process.env.NODE_ENV === "production") {
      const originalError = console.error
      const originalWarn = console.warn
      const originalLog = console.log

      // Suppress all console outputs in production
      console.error = () => {}
      console.warn = () => {}
      console.log = () => {}

      // Handle unhandled promise rejections silently
      const handleRejection = (event: PromiseRejectionEvent) => {
        event.preventDefault()
      }

      window.addEventListener("unhandledrejection", handleRejection)

      return () => {
        console.error = originalError
        console.warn = originalWarn
        console.log = originalLog
        window.removeEventListener("unhandledrejection", handleRejection)
      }
    }
  }, [])

  return null
}
