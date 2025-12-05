"use client"

import { useEffect, useRef } from "react"

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create stars
    const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = []
    for (let i = 0; i < 500; i++) {
      stars.push({
        x: Math.random()   * canvas.width,
        y: Math.random()   * canvas.height,
        size: Math.random() * 2.5 + 0.3,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.9 + 0.2,
      })
    }

    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * (0.5 + 0.5 * Math.sin(Date.now() * 0.001 * star.speed))})`
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" aria-hidden="true" />
}
