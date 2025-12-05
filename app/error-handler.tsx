"use client"

import { useEffect } from "react"

export function ErrorHandler() {
  useEffect(() => {
    // Suppress errors from browser extensions
    const originalError = console.error
    console.error = (...args) => {
      const message = args[0]?.toString() || ""
      
      // Ignore extension-related errors
      if (
        message.includes("chrome-extension://") ||
        message.includes("has not been authorized yet") ||
        message.includes("Extension context invalidated")
      ) {
        return
      }
      
      originalError.apply(console, args)
    }

    // Handle unhandled promise rejections from extensions
    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.toString() || ""
      if (
        reason.includes("chrome-extension://") ||
        reason.includes("has not been authorized yet")
      ) {
        event.preventDefault()
      }
    }

    window.addEventListener("unhandledrejection", handleRejection)

    return () => {
      console.error = originalError
      window.removeEventListener("unhandledrejection", handleRejection)
    }
  }, [])

  return null
}
