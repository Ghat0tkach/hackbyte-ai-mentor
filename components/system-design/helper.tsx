import type { Shape, ConnectionType } from "./types"

// Helper function to draw an arrow
export const drawArrow = (
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  headLength = 10,
  connectionType: ConnectionType = "solid",
) => {
  const angle = Math.atan2(toY - fromY, toX - fromX)

  // Set line style based on connection type
  ctx.save()
  switch (connectionType) {
    case "dashed":
      ctx.setLineDash([8, 4])
      break
    case "dotted":
      ctx.setLineDash([2, 2])
      break
    default:
      ctx.setLineDash([])
  }

  // Draw the line
  ctx.beginPath()
  ctx.moveTo(fromX, fromY)
  ctx.lineTo(toX, toY)
  ctx.stroke()

  // Draw the arrow head
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(toX, toY)
  ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6))
  ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6))
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

// Renderers for system design components
export const ShapeRenderers: Record<string, (ctx: CanvasRenderingContext2D, shape: Shape) => void> = {
  database: (ctx, shape) => {
    const { startX, startY, width = 80, height = 100, text = "Database", color = "#6366f1" } = shape

    // Draw cylinder shape
    const ellipseHeight = height * 0.2

    ctx.fillStyle = "rgba(99, 102, 241, 0.1)"
    ctx.strokeStyle = color

    // Top ellipse
    ctx.beginPath()
    ctx.ellipse(startX + width / 2, startY + ellipseHeight / 2, width / 2, ellipseHeight / 2, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    // Bottom ellipse
    ctx.beginPath()
    ctx.ellipse(
      startX + width / 2,
      startY + height - ellipseHeight / 2,
      width / 2,
      ellipseHeight / 2,
      0,
      0,
      2 * Math.PI,
    )
    ctx.fill()
    ctx.stroke()

    // Sides
    ctx.beginPath()
    ctx.moveTo(startX, startY + ellipseHeight / 2)
    ctx.lineTo(startX, startY + height - ellipseHeight / 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(startX + width, startY + ellipseHeight / 2)
    ctx.lineTo(startX + width, startY + height - ellipseHeight / 2)
    ctx.stroke()

    // Text
    ctx.fillStyle = color
    ctx.font = "14px 'Inter', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(text, startX + width / 2, startY + height + 20)
  },

  server: (ctx, shape) => {
    const { startX, startY, width = 70, height = 100, text = "Server", color = "#6366f1" } = shape

    // Draw server rack
    ctx.fillStyle = "rgba(99, 102, 241, 0.1)"
    ctx.strokeStyle = color

    // Main body
    ctx.beginPath()
    ctx.rect(startX, startY, width, height)
    ctx.fill()
    ctx.stroke()

    // Server details
    const segments = 5
    const segmentHeight = height / segments

    for (let i = 1; i < segments; i++) {
      const y = startY + i * segmentHeight
      ctx.beginPath()
      ctx.moveTo(startX, y)
      ctx.lineTo(startX + width, y)
      ctx.stroke()

      // Add small circle for LED
      const ledY = y - segmentHeight / 2
      ctx.beginPath()
      ctx.arc(startX + width - 10, ledY, 3, 0, 2 * Math.PI)
      ctx.fillStyle = i % 2 === 0 ? "#22c55e" : "#ef4444"
      ctx.fill()
    }

    // Text
    ctx.fillStyle = color
    ctx.font = "14px 'Inter', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(text, startX + width / 2, startY + height + 20)
  },

  cloud: (ctx, shape) => {
    const { startX, startY, width = 100, height = 60, text = "Cloud", color = "#6366f1" } = shape

    ctx.fillStyle = "rgba(99, 102, 241, 0.1)"
    ctx.strokeStyle = color

    // Draw cloud shape
    ctx.beginPath()

    // Main circle
    const centerX = startX + width / 2
    const centerY = startY + height / 2
    const radius = Math.min(width, height) / 3

    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)

    // Additional circles to form cloud shape
    ctx.arc(centerX - radius, centerY, radius * 0.8, 0, 2 * Math.PI)
    ctx.arc(centerX + radius, centerY, radius * 0.8, 0, 2 * Math.PI)
    ctx.arc(centerX - radius / 2, centerY - radius / 2, radius * 0.7, 0, 2 * Math.PI)
    ctx.arc(centerX + radius / 2, centerY - radius / 2, radius * 0.7, 0, 2 * Math.PI)

    ctx.fill()
    ctx.stroke()

    // Text
    ctx.fillStyle = color
    ctx.font = "14px 'Inter', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(text, centerX, startY + height + 20)
  },

  cache: (ctx, shape) => {
    const { startX, startY, width = 80, height = 60, text = "Cache", color = "#6366f1" } = shape

    ctx.fillStyle = "rgba(99, 102, 241, 0.1)"
    ctx.strokeStyle = color

    // Draw hexagon for cache
    const centerX = startX + width / 2
    const centerY = startY + height / 2
    const radius = Math.min(width, height) / 2

    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Draw lightning bolt inside
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - radius * 0.5)
    ctx.lineTo(centerX - radius * 0.3, centerY)
    ctx.lineTo(centerX, centerY - radius * 0.1)
    ctx.lineTo(centerX, centerY + radius * 0.5)
    ctx.lineTo(centerX + radius * 0.3, centerY)
    ctx.lineTo(centerX, centerY + radius * 0.1)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()

    // Text
    ctx.fillStyle = color
    ctx.font = "14px 'Inter', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(text, centerX, startY + height + 20)
  },

  loadBalancer: (ctx, shape) => {
    const { startX, startY, width = 80, height = 60, text = "Load Balancer", color = "#6366f1" } = shape

    ctx.fillStyle = "rgba(99, 102, 241, 0.1)"
    ctx.strokeStyle = color

    // Draw diamond shape
    const centerX = startX + width / 2
    const centerY = startY + height / 2

    ctx.beginPath()
    ctx.moveTo(centerX, startY)
    ctx.lineTo(startX + width, centerY)
    ctx.lineTo(centerX, startY + height)
    ctx.lineTo(startX, centerY)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Draw arrows inside
    ctx.beginPath()
    ctx.moveTo(centerX - width * 0.2, centerY - height * 0.1)
    ctx.lineTo(centerX + width * 0.2, centerY - height * 0.1)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(centerX - width * 0.2, centerY)
    ctx.lineTo(centerX + width * 0.2, centerY)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(centerX - width * 0.2, centerY + height * 0.1)
    ctx.lineTo(centerX + width * 0.2, centerY + height * 0.1)
    ctx.stroke()

    // Arrow heads
    const arrowSize = 5

    // Top arrow
    ctx.beginPath()
    ctx.moveTo(centerX + width * 0.2, centerY - height * 0.1)
    ctx.lineTo(centerX + width * 0.2 - arrowSize, centerY - height * 0.1 - arrowSize / 2)
    ctx.lineTo(centerX + width * 0.2 - arrowSize, centerY - height * 0.1 + arrowSize / 2)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()

    // Middle arrow
    ctx.beginPath()
    ctx.moveTo(centerX + width * 0.2, centerY)
    ctx.lineTo(centerX + width * 0.2 - arrowSize, centerY - arrowSize / 2)
    ctx.lineTo(centerX + width * 0.2 - arrowSize, centerY + arrowSize / 2)
    ctx.closePath()
    ctx.fill()

    // Bottom arrow
    ctx.beginPath()
    ctx.moveTo(centerX + width * 0.2, centerY + height * 0.1)
    ctx.lineTo(centerX + width * 0.2 - arrowSize, centerY + height * 0.1 - arrowSize / 2)
    ctx.lineTo(centerX + width * 0.2 - arrowSize, centerY + height * 0.1 + arrowSize / 2)
    ctx.closePath()
    ctx.fill()

    // Text
    ctx.fillStyle = color
    ctx.font = "14px 'Inter', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(text, centerX, startY + height + 20)
  },

  user: (ctx, shape) => {
    const { startX, startY, width = 50, height = 80, text = "User", color = "#6366f1" } = shape

    ctx.fillStyle = "rgba(99, 102, 241, 0.1)"
    ctx.strokeStyle = color

    const centerX = startX + width / 2
    const headRadius = width * 0.4
    const headY = startY + headRadius + 5

    // Draw head
    ctx.beginPath()
    ctx.arc(centerX, headY, headRadius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    // Draw body
    const bodyStartY = headY + headRadius
    const bodyHeight = height - (bodyStartY - startY)

    ctx.beginPath()
    ctx.moveTo(centerX, bodyStartY)
    ctx.lineTo(centerX, bodyStartY + bodyHeight * 0.6)

    // Draw legs
    ctx.moveTo(centerX, bodyStartY + bodyHeight * 0.4)
    ctx.lineTo(centerX - width * 0.3, startY + height)

    ctx.moveTo(centerX, bodyStartY + bodyHeight * 0.4)
    ctx.lineTo(centerX + width * 0.3, startY + height)

    // Draw arms
    ctx.moveTo(centerX, bodyStartY + bodyHeight * 0.2)
    ctx.lineTo(centerX - width * 0.4, bodyStartY + bodyHeight * 0.3)

    ctx.moveTo(centerX, bodyStartY + bodyHeight * 0.2)
    ctx.lineTo(centerX + width * 0.4, bodyStartY + bodyHeight * 0.3)

    ctx.stroke()

    // Text
    ctx.fillStyle = color
    ctx.font = "14px 'Inter', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(text, centerX, startY + height + 20)
  },

  api: (ctx, shape) => {
    const { startX, startY, width = 90, height = 70, text = "API Gateway", color = "#6366f1" } = shape

    ctx.fillStyle = "rgba(99, 102, 241, 0.1)"
    ctx.strokeStyle = color

    // Draw rounded rectangle
    const radius = 10
    ctx.beginPath()
    ctx.moveTo(startX + radius, startY)
    ctx.lineTo(startX + width - radius, startY)
    ctx.quadraticCurveTo(startX + width, startY, startX + width, startY + radius)
    ctx.lineTo(startX + width, startY + height - radius)
    ctx.quadraticCurveTo(startX + width, startY + height, startX + width - radius, startY + height)
    ctx.lineTo(startX + radius, startY + height)
    ctx.quadraticCurveTo(startX, startY + height, startX, startY + height - radius)
    ctx.lineTo(startX, startY + radius)
    ctx.quadraticCurveTo(startX, startY, startX + radius, startY)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Draw API text inside
    ctx.fillStyle = color
    ctx.font = "16px 'Inter', sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("API", startX + width / 2, startY + height / 2)

    // Draw component name below
    ctx.font = "14px 'Inter', sans-serif"
    ctx.fillText(text, startX + width / 2, startY + height + 20)
  },

  microservice: (ctx, shape) => {
    const { startX, startY, width = 80, height = 80, text = "Microservice", color = "#6366f1" } = shape

    ctx.fillStyle = "rgba(99, 102, 241, 0.1)"
    ctx.strokeStyle = color

    // Draw hexagon
    const centerX = startX + width / 2
    const centerY = startY + height / 2
    const radius = Math.min(width, height) / 2

    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 - Math.PI / 6
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Draw gear icon inside
    const gearRadius = radius * 0.6
    const toothCount = 8
    const toothDepth = gearRadius * 0.2

    ctx.beginPath()
    for (let i = 0; i < toothCount * 2; i++) {
      const angle = (i * Math.PI) / toothCount
      const r = i % 2 === 0 ? gearRadius + toothDepth : gearRadius
      const x = centerX + r * Math.cos(angle)
      const y = centerY + r * Math.sin(angle)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.closePath()
    ctx.fillStyle = "rgba(99, 102, 241, 0.3)"
    ctx.fill()
    ctx.stroke()

    // Draw inner circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, gearRadius * 0.3, 0, 2 * Math.PI)
    ctx.fillStyle = "rgba(99, 102, 241, 0.5)"
    ctx.fill()
    ctx.stroke()

    // Draw component name below
    ctx.fillStyle = color
    ctx.font = "14px 'Inter', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(text, centerX, startY + height + 20)
  },

  queue: (ctx, shape) => {
    const { startX, startY, width = 100, height = 50, text = "Message Queue", color = "#6366f1" } = shape

    ctx.fillStyle = "rgba(99, 102, 241, 0.1)"
    ctx.strokeStyle = color

    // Draw rounded rectangle
    const radius = 10
    ctx.beginPath()
    ctx.moveTo(startX + radius, startY)
    ctx.lineTo(startX + width - radius, startY)
    ctx.quadraticCurveTo(startX + width, startY, startX + width, startY + radius)
    ctx.lineTo(startX + width, startY + height - radius)
    ctx.quadraticCurveTo(startX + width, startY + height, startX + width - radius, startY + height)
    ctx.lineTo(startX + radius, startY + height)
    ctx.quadraticCurveTo(startX, startY + height, startX, startY + height - radius)
    ctx.lineTo(startX, startY + radius)
    ctx.quadraticCurveTo(startX, startY, startX + radius, startY)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Draw message boxes inside
    const boxWidth = 15
    const boxHeight = 15
    const boxGap = 10
    const startBoxX = startX + 15
    const boxY = startY + (height - boxHeight) / 2

    for (let i = 0; i < 4; i++) {
      const boxX = startBoxX + i * (boxWidth + boxGap)
      ctx.beginPath()
      ctx.rect(boxX, boxY, boxWidth, boxHeight)
      ctx.fillStyle = i % 2 === 0 ? "rgba(99, 102, 241, 0.3)" : "rgba(99, 102, 241, 0.5)"
      ctx.fill()
      ctx.stroke()
    }

    // Draw arrow
    ctx.beginPath()
    ctx.moveTo(startX + width - 20, boxY + boxHeight / 2)
    ctx.lineTo(startX + width - 10, boxY + boxHeight / 2)
    ctx.stroke()

    // Draw arrowhead
    ctx.beginPath()
    ctx.moveTo(startX + width - 10, boxY + boxHeight / 2)
    ctx.lineTo(startX + width - 15, boxY + boxHeight / 2 - 5)
    ctx.lineTo(startX + width - 15, boxY + boxHeight / 2 + 5)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()

    // Draw component name below
    ctx.fillStyle = color
    ctx.font = "14px 'Inter', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(text, startX + width / 2, startY + height + 20)
  },

  storage: (ctx, shape) => {
    const { startX, startY, width = 80, height = 90, text = "Storage", color = "#6366f1" } = shape

    ctx.fillStyle = "rgba(99, 102, 241, 0.1)"
    ctx.strokeStyle = color

    // Draw storage cylinder
    const ellipseHeight = height * 0.15

    // Top ellipse
    ctx.beginPath()
    ctx.ellipse(startX + width / 2, startY + ellipseHeight / 2, width / 2, ellipseHeight / 2, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    // Bottom ellipse
    ctx.beginPath()
    ctx.ellipse(
      startX + width / 2,
      startY + height - ellipseHeight / 2,
      width / 2,
      ellipseHeight / 2,
      0,
      0,
      2 * Math.PI,
    )
    ctx.fill()
    ctx.stroke()

    // Sides
    ctx.beginPath()
    ctx.moveTo(startX, startY + ellipseHeight / 2)
    ctx.lineTo(startX, startY + height - ellipseHeight / 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(startX + width, startY + ellipseHeight / 2)
    ctx.lineTo(startX + width, startY + height - ellipseHeight / 2)
    ctx.stroke()

    // Draw disk lines
    const diskCount = 3
    const diskGap = (height - ellipseHeight) / (diskCount + 1)

    for (let i = 1; i <= diskCount; i++) {
      const y = startY + ellipseHeight / 2 + i * diskGap

      ctx.beginPath()
      ctx.ellipse(startX + width / 2, y, width / 2, ellipseHeight / 4, 0, 0, 2 * Math.PI)
      ctx.fillStyle = "rgba(99, 102, 241, 0.2)"
      ctx.fill()
      ctx.stroke()
    }

    // Draw component name below
    ctx.fillStyle = color
    ctx.font = "14px 'Inter', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(text, startX + width / 2, startY + height + 20)
  },

  cdn: (ctx, shape) => {
    const { startX, startY, width = 90, height = 60, text = "CDN", color = "#6366f1" } = shape

    ctx.fillStyle = "rgba(99, 102, 241, 0.1)"
    ctx.strokeStyle = color

    // Draw cloud shape
    const centerX = startX + width / 2
    const centerY = startY + height / 2
    const radius = Math.min(width, height) / 3

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.arc(centerX - radius * 0.8, centerY, radius * 0.6, 0, 2 * Math.PI)
    ctx.arc(centerX + radius * 0.8, centerY, radius * 0.6, 0, 2 * Math.PI)
    ctx.arc(centerX, centerY - radius * 0.6, radius * 0.5, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    // Draw globe lines
    ctx.beginPath()
    ctx.ellipse(centerX, centerY, radius * 0.7, radius * 0.7, 0, 0, 2 * Math.PI)
    ctx.stroke()

    // Draw horizontal line
    ctx.beginPath()
    ctx.moveTo(centerX - radius * 0.7, centerY)
    ctx.lineTo(centerX + radius * 0.7, centerY)
    ctx.stroke()

    // Draw vertical line
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - radius * 0.7)
    ctx.lineTo(centerX, centerY + radius * 0.7)
    ctx.stroke()

    // Draw component name below
    ctx.fillStyle = color
    ctx.font = "14px 'Inter', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(text, centerX, startY + height + 20)
  },

  firewall: (ctx, shape) => {
    const { startX, startY, width = 70, height = 80, text = "Firewall", color = "#6366f1" } = shape

    ctx.fillStyle = "rgba(99, 102, 241, 0.1)"
    ctx.strokeStyle = color

    // Draw brick wall
    ctx.beginPath()
    ctx.rect(startX, startY, width, height)
    ctx.fill()
    ctx.stroke()

    // Draw brick pattern
    const brickHeight = 15
    const brickWidth = width / 2

    for (let row = 0; row < Math.floor(height / brickHeight); row++) {
      const offset = row % 2 === 0 ? 0 : brickWidth / 2

      for (let col = 0; col < 2; col++) {
        const x = startX + col * brickWidth + offset
        const y = startY + row * brickHeight

        // Don't draw partial bricks at the edges
        if (x + brickWidth <= startX + width && y + brickHeight <= startY + height) {
          ctx.beginPath()
          ctx.rect(x, y, brickWidth, brickHeight)
          ctx.stroke()
        }
      }
    }

    // Draw flame icon
    const flameWidth = width * 0.4
    const flameHeight = height * 0.3
    const flameX = startX + (width - flameWidth) / 2
    const flameY = startY + height * 0.35

    ctx.beginPath()
    ctx.moveTo(flameX + flameWidth / 2, flameY)
    ctx.quadraticCurveTo(flameX + flameWidth * 0.3, flameY + flameHeight * 0.5, flameX, flameY + flameHeight * 0.7)
    ctx.quadraticCurveTo(flameX + flameWidth * 0.2, flameY + flameHeight, flameX + flameWidth / 2, flameY + flameHeight)
    ctx.quadraticCurveTo(
      flameX + flameWidth * 0.8,
      flameY + flameHeight,
      flameX + flameWidth,
      flameY + flameHeight * 0.7,
    )
    ctx.quadraticCurveTo(flameX + flameWidth * 0.7, flameY + flameHeight * 0.5, flameX + flameWidth / 2, flameY)
    ctx.fillStyle = "rgba(239, 68, 68, 0.5)"
    ctx.fill()
    ctx.stroke()

    // Draw component name below
    ctx.fillStyle = color
    ctx.font = "14px 'Inter', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(text, startX + width / 2, startY + height + 20)
  },

  analytics: (ctx, shape) => {
    const { startX, startY, width = 80, height = 70, text = "Analytics", color = "#6366f1" } = shape

    ctx.fillStyle = "rgba(99, 102, 241, 0.1)"
    ctx.strokeStyle = color

    // Draw rounded rectangle
    const radius = 10
    ctx.beginPath()
    ctx.moveTo(startX + radius, startY)
    ctx.lineTo(startX + width - radius, startY)
    ctx.quadraticCurveTo(startX + width, startY, startX + width, startY + radius)
    ctx.lineTo(startX + width, startY + height - radius)
    ctx.quadraticCurveTo(startX + width, startY + height, startX + width - radius, startY + height)
    ctx.lineTo(startX + radius, startY + height)
    ctx.quadraticCurveTo(startX, startY + height, startX, startY + height - radius)
    ctx.lineTo(startX, startY + radius)
    ctx.quadraticCurveTo(startX, startY, startX + radius, startY)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Draw bar chart
    const chartX = startX + width * 0.2
    const chartY = startY + height * 0.7
    const chartWidth = width * 0.6
    const chartHeight = height * 0.4

    // X and Y axes
    ctx.beginPath()
    ctx.moveTo(chartX, chartY - chartHeight)
    ctx.lineTo(chartX, chartY)
    ctx.lineTo(chartX + chartWidth, chartY)
    ctx.stroke()

    // Bars
    const barCount = 4
    const barWidth = chartWidth / (barCount * 2)

    for (let i = 0; i < barCount; i++) {
      const barHeight = Math.random() * chartHeight * 0.8 + chartHeight * 0.2
      const barX = chartX + i * barWidth * 2 + barWidth / 2

      ctx.beginPath()
      ctx.rect(barX, chartY - barHeight, barWidth, barHeight)
      ctx.fillStyle = `rgba(99, 102, 241, ${0.3 + i * 0.15})`
      ctx.fill()
      ctx.stroke()
    }

    // Draw line chart
    const lineY = startY + height * 0.3
    const lineHeight = height * 0.2

    ctx.beginPath()
    ctx.moveTo(chartX, lineY + Math.random() * lineHeight)

    for (let i = 1; i <= 4; i++) {
      const pointX = chartX + (chartWidth / 4) * i
      const pointY = lineY + Math.random() * lineHeight
      ctx.lineTo(pointX, pointY)
    }

    ctx.strokeStyle = "#ec4899"
    ctx.stroke()

    // Reset stroke style
    ctx.strokeStyle = color

    // Draw component name below
    ctx.fillStyle = color
    ctx.font = "14px 'Inter', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(text, startX + width / 2, startY + height + 20)
  },

  mobile: (ctx, shape) => {
    const { startX, startY, width = 50, height = 90, text = "Mobile App", color = "#6366f1" } = shape

    ctx.fillStyle = "rgba(99, 102, 241, 0.1)"
    ctx.strokeStyle = color

    // Draw smartphone shape
    const radius = 10
    ctx.beginPath()
    ctx.moveTo(startX + radius, startY)
    ctx.lineTo(startX + width - radius, startY)
    ctx.quadraticCurveTo(startX + width, startY, startX + width, startY + radius)
    ctx.lineTo(startX + width, startY + height - radius)
    ctx.quadraticCurveTo(startX + width, startY + height, startX + width - radius, startY + height)
    ctx.lineTo(startX + radius, startY + height)
    ctx.quadraticCurveTo(startX, startY + height, startX, startY + height - radius)
    ctx.lineTo(startX, startY + radius)
    ctx.quadraticCurveTo(startX, startY, startX + radius, startY)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Draw screen
    const screenMargin = 5
    ctx.beginPath()
    ctx.rect(startX + screenMargin, startY + screenMargin, width - screenMargin * 2, height - screenMargin * 2)
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.fill()
    ctx.stroke()

    // Draw home button
    ctx.beginPath()
    ctx.arc(startX + width / 2, startY + height - screenMargin / 2, screenMargin / 2, 0, 2 * Math.PI)
    ctx.fillStyle = "rgba(99, 102, 241, 0.3)"
    ctx.fill()
    ctx.stroke()

    // Draw app icons (simplified)
    const iconSize = 8
    const iconGap = 5
    const iconsStartX = startX + screenMargin + iconGap
    const iconsStartY = startY + screenMargin + iconGap

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const iconX = iconsStartX + col * (iconSize + iconGap)
        const iconY = iconsStartY + row * (iconSize + iconGap)

        ctx.beginPath()
        ctx.rect(iconX, iconY, iconSize, iconSize)
        ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`
        ctx.fill()
      }
    }

    // Draw component name below
    ctx.fillStyle = color
    ctx.font = "14px 'Inter', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(text, startX + width / 2, startY + height + 20)
  },

  web: (ctx, shape) => {
    const { startX, startY, width = 90, height = 70, text = "Web App", color = "#6366f1" } = shape

    ctx.fillStyle = "rgba(99, 102, 241, 0.1)"
    ctx.strokeStyle = color

    // Draw browser window
    const radius = 5
    ctx.beginPath()
    ctx.moveTo(startX + radius, startY)
    ctx.lineTo(startX + width - radius, startY)
    ctx.quadraticCurveTo(startX + width, startY, startX + width, startY + radius)
    ctx.lineTo(startX + width, startY + height - radius)
    ctx.quadraticCurveTo(startX + width, startY + height, startX + width - radius, startY + height)
    ctx.lineTo(startX + radius, startY + height)
    ctx.quadraticCurveTo(startX, startY + height, startX, startY + height - radius)
    ctx.lineTo(startX, startY + radius)
    ctx.quadraticCurveTo(startX, startY, startX + radius, startY)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Draw browser toolbar
    const toolbarHeight = 15
    ctx.beginPath()
    ctx.moveTo(startX, startY + toolbarHeight)
    ctx.lineTo(startX + width, startY + toolbarHeight)
    ctx.stroke()

    // Draw browser buttons
    const buttonRadius = 3
    const buttonGap = 8
    const buttonsY = startY + toolbarHeight / 2

    // Close button
    ctx.beginPath()
    ctx.arc(startX + buttonGap, buttonsY, buttonRadius, 0, 2 * Math.PI)
    ctx.fillStyle = "#ef4444"
    ctx.fill()

    // Minimize button
    ctx.beginPath()
    ctx.arc(startX + buttonGap * 2.5, buttonsY, buttonRadius, 0, 2 * Math.PI)
    ctx.fillStyle = "#eab308"
    ctx.fill()

    // Maximize button
    ctx.beginPath()
    ctx.arc(startX + buttonGap * 4, buttonsY, buttonRadius, 0, 2 * Math.PI)
    ctx.fillStyle = "#22c55e"
    ctx.fill()

    // Draw address bar
    const addressBarWidth = width * 0.7
    const addressBarHeight = 10
    const addressBarX = startX + (width - addressBarWidth) / 2
    const addressBarY = startY + (toolbarHeight - addressBarHeight) / 2

    ctx.beginPath()
    ctx.rect(addressBarX, addressBarY, addressBarWidth, addressBarHeight)
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.fill()
    ctx.stroke()

    // Draw page content (simplified)
    const contentStartY = startY + toolbarHeight + 5
    const contentHeight = height - toolbarHeight - 10

    // Header
    ctx.beginPath()
    ctx.rect(startX + 10, contentStartY, width - 20, 10)
    ctx.fillStyle = "rgba(99, 102, 241, 0.3)"
    ctx.fill()

    // Content blocks
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.rect(startX + 10, contentStartY + 15 + i * 12, width - 20, 8)
      ctx.fillStyle = "rgba(99, 102, 241, 0.2)"
      ctx.fill()
    }

    // Draw component name below
    ctx.fillStyle = color
    ctx.font = "14px 'Inter', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(text, startX + width / 2, startY + height + 20)
  },

  container: (ctx, shape) => {
    const { startX, startY, width = 80, height = 80, text = "Container", color = "#6366f1" } = shape

    ctx.fillStyle = "rgba(99, 102, 241, 0.1)"
    ctx.strokeStyle = color

    // Draw container box
    const boxWidth = width
    const boxHeight = height * 0.8
    const boxY = startY + height - boxHeight

    ctx.beginPath()
    ctx.rect(startX, boxY, boxWidth, boxHeight)
    ctx.fill()
    ctx.stroke()

    // Draw container lid
    const lidWidth = width * 1.1
    const lidHeight = height * 0.2
    const lidX = startX - (lidWidth - width) / 2
    const lidY = boxY - lidHeight / 2

    ctx.beginPath()
    ctx.rect(lidX, lidY, lidWidth, lidHeight)
    ctx.fillStyle = "rgba(99, 102, 241, 0.2)"
    ctx.fill()
    ctx.stroke()

    // Draw container logo
    const logoSize = Math.min(width, height) * 0.4
    const logoX = startX + (width - logoSize) / 2
    const logoY = boxY + (boxHeight - logoSize) / 2

    // Draw whale shape (simplified Docker-like logo)
    ctx.beginPath()
    ctx.moveTo(logoX, logoY + logoSize * 0.6)
    ctx.bezierCurveTo(
      logoX,
      logoY + logoSize * 0.3,
      logoX + logoSize * 0.4,
      logoY + logoSize * 0.3,
      logoX + logoSize * 0.5,
      logoY + logoSize * 0.5,
    )
    ctx.bezierCurveTo(
      logoX + logoSize * 0.6,
      logoY + logoSize * 0.3,
      logoX + logoSize,
      logoY + logoSize * 0.3,
      logoX + logoSize,
      logoY + logoSize * 0.6,
    )
    ctx.lineTo(logoX, logoY + logoSize * 0.6)
    ctx.fillStyle = "rgba(6, 182, 212, 0.5)"
    ctx.fill()
    ctx.stroke()

    // Draw component name below
    ctx.fillStyle = color
    ctx.font = "14px 'Inter', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(text, startX + width / 2, startY + height + 20)
  },
}

