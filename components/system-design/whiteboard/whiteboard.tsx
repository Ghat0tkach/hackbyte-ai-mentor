"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import type { Shape, ShapeType, WhiteboardProps, ConnectionType } from "../types"
import { drawArrow, ShapeRenderers } from "../helper"
import { TextInputOverlay, ToolBar } from "./whiteboard-components"

const Whiteboard: React.FC<WhiteboardProps> = ({ width = "100%", height = "100%", onExport, onImport, onStream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
  const [shapes, setShapes] = useState<Shape[]>([])
  const [currentShape, setCurrentShape] = useState<Shape | null>(null)
  const [selectedTool, setSelectedTool] = useState<ShapeType>("freehand")
  const [currentColor, setCurrentColor] = useState<string>("#6366f1")
  const [textInput, setTextInput] = useState<string>("")
  const [showTextInput, setShowTextInput] = useState<boolean>(false)
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 })
  const [selectedShape, setSelectedShape] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [connectionType, setConnectionType] = useState<ConnectionType>("solid")
  const [gridVisible, setGridVisible] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStart, setConnectionStart] = useState<Shape | null>(null)

  // Initialize canvas and set up event listeners
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to match parent container
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        // Set fixed dimensions based on parent container
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
      // Fill with white background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Redraw all shapes when resizing
      redrawCanvas()
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Set drawing style
    ctx.strokeStyle = currentColor
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    setContext(ctx)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [shapes, currentColor, gridVisible, zoom, pan])

  // Draw grid
  const drawGrid = () => {
    if (!context || !canvasRef.current || !gridVisible) return

    const { width, height } = canvasRef.current
    const gridSize = 20

    context.save()
    context.strokeStyle = "rgba(226, 232, 240, 0.6)"
    context.lineWidth = 0.5

    // Apply zoom and pan
    context.translate(pan.x, pan.y)
    context.scale(zoom, zoom)

    // Draw vertical lines
    for (let x = 0; x <= width / zoom; x += gridSize) {
      context.beginPath()
      context.moveTo(x, 0)
      context.lineTo(x, height / zoom)
      context.stroke()
    }

    // Draw horizontal lines
    for (let y = 0; y <= height / zoom; y += gridSize) {
      context.beginPath()
      context.moveTo(0, y)
      context.lineTo(width / zoom, y)
      context.stroke()
    }

    context.restore()
  }

  // Draw a shape based on its type
  const drawShape = (shape: Shape) => {
    if (!context) return

    context.save()
    context.strokeStyle = shape.color
    context.fillStyle = shape.color
    context.lineWidth = 2

    // Apply zoom and pan
    context.translate(pan.x, pan.y)
    context.scale(zoom, zoom)

    switch (shape.type) {
      case "rectangle":
        if (shape.endX !== undefined && shape.endY !== undefined) {
          context.beginPath()
          context.rect(shape.startX, shape.startY, shape.endX - shape.startX, shape.endY - shape.startY)
          context.stroke()
        }
        break

      case "circle":
        if (shape.endX !== undefined && shape.endY !== undefined) {
          const radius = Math.sqrt(Math.pow(shape.endX - shape.startX, 2) + Math.pow(shape.endY - shape.startY, 2))
          context.beginPath()
          context.arc(shape.startX, shape.startY, radius, 0, 2 * Math.PI)
          context.stroke()
        }
        break

      case "arrow":
      case "connection":
        if (shape.endX !== undefined && shape.endY !== undefined) {
          drawArrow(context, shape.startX, shape.startY, shape.endX, shape.endY, 10, shape.connectionType || "solid")
        }
        break

      case "text":
        if (shape.text) {
          context.font = "16px 'Inter', sans-serif"
          context.fillText(shape.text, shape.startX, shape.startY)
        }
        break

      case "freehand":
        if (shape.points && shape.points.length > 0) {
          context.beginPath()
          context.moveTo(shape.points[0].x, shape.points[0].y)

          for (let i = 1; i < shape.points.length; i++) {
            context.lineTo(shape.points[i].x, shape.points[i].y)
          }

          context.stroke()
        }
        break

      // System design components
      case "database":
      case "server":
      case "cloud":
      case "cache":
      case "loadBalancer":
      case "user":
      case "api":
      case "microservice":
      case "queue":
      case "storage":
      case "cdn":
      case "firewall":
      case "analytics":
      case "mobile":
      case "web":
      case "container":
        ShapeRenderers[shape.type](context, shape)
        break
    }

    // If shape is selected, draw selection indicator
    if (selectedShape === shape.id) {
      if (shape.type === "freehand" && shape.points) {
        // For freehand, draw a bounding box
        let minX = Number.POSITIVE_INFINITY,
          minY = Number.POSITIVE_INFINITY,
          maxX = Number.NEGATIVE_INFINITY,
          maxY = Number.NEGATIVE_INFINITY

        for (const point of shape.points) {
          minX = Math.min(minX, point.x)
          minY = Math.min(minY, point.y)
          maxX = Math.max(maxX, point.x)
          maxY = Math.max(maxY, point.y)
        }

        context.strokeStyle = "#3b82f6"
        context.lineWidth = 1
        context.setLineDash([5, 3])
        context.strokeRect(minX - 5, minY - 5, maxX - minX + 10, maxY - minY + 10)
        context.setLineDash([])
      } else if (shape.type === "text") {
        // For text, draw a bounding box
        const textWidth = context.measureText(shape.text || "").width
        context.strokeStyle = "#3b82f6"
        context.lineWidth = 1
        context.setLineDash([5, 3])
        context.strokeRect(shape.startX - 5, shape.startY - 20, textWidth + 10, 25)
        context.setLineDash([])
      } else if (shape.endX !== undefined && shape.endY !== undefined) {
        // For shapes with dimensions
        context.strokeStyle = "#3b82f6"
        context.lineWidth = 1
        context.setLineDash([5, 3])

        if (shape.type === "circle") {
          const radius = Math.sqrt(Math.pow(shape.endX - shape.startX, 2) + Math.pow(shape.endY - shape.startY, 2))
          context.beginPath()
          context.arc(shape.startX, shape.startY, radius + 5, 0, 2 * Math.PI)
          context.stroke()
        } else if (shape.type === "arrow" || shape.type === "connection") {
          // For arrows, highlight the line
          context.beginPath()
          context.moveTo(shape.startX, shape.startY)
          context.lineTo(shape.endX, shape.endY)
          context.stroke()
        } else {
          // For rectangles and other shapes
          const minX = Math.min(shape.startX, shape.endX)
          const minY = Math.min(shape.startY, shape.endY)
          const width = Math.abs(shape.endX - shape.startX)
          const height = Math.abs(shape.endY - shape.startY)
          context.strokeRect(minX - 5, minY - 5, width + 10, height + 10)
        }

        context.setLineDash([])
      } else if (shape.width && shape.height) {
        // For system design components
        context.strokeStyle = "#3b82f6"
        context.lineWidth = 1
        context.setLineDash([5, 3])
        context.strokeRect(shape.startX - 5, shape.startY - 5, shape.width + 10, shape.height + 10)
        context.setLineDash([])
      }
    }

    context.restore()
  }

  // Redraw all shapes on the canvas
  const redrawCanvas = () => {
    if (!context || !canvasRef.current) return

    // Clear canvas
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Draw grid
    drawGrid()

    // Redraw all shapes
    shapes.forEach((shape) => {
      drawShape(shape)
    })
  }

  // Find shape at a specific position for interaction
  const findShapeAtPosition = (x: number, y: number): Shape | null => {
    // Adjust for zoom and pan
    const adjustedX = (x - pan.x) / zoom
    const adjustedY = (y - pan.y) / zoom

    // Search in reverse order to find the topmost shape first
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i]

      // Check for freehand drawings
      if (shape.type === "freehand") {
        if (shape.points && shape.points.length > 0) {
          // Check if point is near any segment of the freehand drawing
          for (let j = 1; j < shape.points.length; j++) {
            const p1 = shape.points[j - 1]
            const p2 = shape.points[j]

            // Calculate distance from point to line segment
            const A = adjustedX - p1.x
            const B = adjustedY - p1.y
            const C = p2.x - p1.x
            const D = p2.y - p1.y

            const dot = A * C + B * D
            const lenSq = C * C + D * D
            let param = -1

            if (lenSq !== 0) param = dot / lenSq

            let xx, yy

            if (param < 0) {
              xx = p1.x
              yy = p1.y
            } else if (param > 1) {
              xx = p2.x
              yy = p2.y
            } else {
              xx = p1.x + param * C
              yy = p1.y + param * D
            }

            const dx = adjustedX - xx
            const dy = adjustedY - yy
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 10) return shape // 10px threshold for selection
          }
        }
      }

      if (shape.type === "circle") {
        if (shape.endX !== undefined && shape.endY !== undefined) {
          const radius = Math.sqrt(Math.pow(shape.endX - shape.startX, 2) + Math.pow(shape.endY - shape.startY, 2))
          const distance = Math.sqrt(Math.pow(adjustedX - shape.startX, 2) + Math.pow(adjustedY - shape.startY, 2))
          if (distance <= radius) return shape
        }
      } else if (
        [
          "database",
          "server",
          "cloud",
          "cache",
          "loadBalancer",
          "user",
          "api",
          "microservice",
          "queue",
          "storage",
          "cdn",
          "firewall",
          "analytics",
          "mobile",
          "web",
          "container",
        ].includes(shape.type)
      ) {
        const width = shape.width || 80
        const height = shape.height || 100
        if (
          adjustedX >= shape.startX &&
          adjustedX <= shape.startX + width &&
          adjustedY >= shape.startY &&
          adjustedY <= shape.startY + height
        ) {
          return shape
        }
      } else if (shape.type === "rectangle") {
        if (shape.endX !== undefined && shape.endY !== undefined) {
          const minX = Math.min(shape.startX, shape.endX)
          const maxX = Math.max(shape.startX, shape.endX)
          const minY = Math.min(shape.startY, shape.endY)
          const maxY = Math.max(shape.startY, shape.endY)

          if (adjustedX >= minX && adjustedX <= maxX && adjustedY >= minY && adjustedY <= maxY) {
            return shape
          }
        }
      } else if (shape.type === "arrow" || shape.type === "connection") {
        // Simplified arrow selection - check if point is near the line
        if (shape.endX !== undefined && shape.endY !== undefined) {
          // Calculate distance from point to line segment
          const A = adjustedX - shape.startX
          const B = adjustedY - shape.startY
          const C = shape.endX - shape.startX
          const D = shape.endY - shape.startY

          const dot = A * C + B * D
          const lenSq = C * C + D * D
          let param = -1

          if (lenSq !== 0) param = dot / lenSq

          let xx, yy

          if (param < 0) {
            xx = shape.startX
            yy = shape.startY
          } else if (param > 1) {
            xx = shape.endX
            yy = shape.endY
          } else {
            xx = shape.startX + param * C
            yy = shape.startY + param * D
          }

          const dx = adjustedX - xx
          const dy = adjustedY - yy
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 10) return shape // 10px threshold for arrow selection
        }
      } else if (shape.type === "text") {
        // Approximate text bounds
        const textWidth = context?.measureText(shape.text || "").width || 0
        if (
          adjustedX >= shape.startX &&
          adjustedX <= shape.startX + textWidth &&
          adjustedY >= shape.startY - 16 &&
          adjustedY <= shape.startY
        ) {
          return shape
        }
      }
    }

    return null
  }

  // Get default text for system design components
  const getDefaultText = (type: ShapeType): string => {
    switch (type) {
      case "database":
        return "Database"
      case "server":
        return "Server"
      case "cloud":
        return "Cloud"
      case "cache":
        return "Cache"
      case "loadBalancer":
        return "Load Balancer"
      case "user":
        return "User"
      case "api":
        return "API Gateway"
      case "microservice":
        return "Microservice"
      case "queue":
        return "Message Queue"
      case "storage":
        return "Storage"
      case "cdn":
        return "CDN"
      case "firewall":
        return "Firewall"
      case "analytics":
        return "Analytics"
      case "mobile":
        return "Mobile App"
      case "web":
        return "Web App"
      case "container":
        return "Container"
      default:
        return ""
    }
  }

  // Start drawing or dragging
  const startDrawing = (e: React.MouseEvent) => {
    if (!context || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Adjust for zoom and pan
    const adjustedX = (x - pan.x) / zoom
    const adjustedY = (y - pan.y) / zoom

    // Check if we're clicking on an existing shape to drag
    const clickedShape = findShapeAtPosition(x, y)

    if (clickedShape) {
      setSelectedShape(clickedShape.id)

      // If we're in connection mode, handle connection
      if (selectedTool === "connection") {
        if (!isConnecting) {
          setIsConnecting(true)
          setConnectionStart(clickedShape)
        } else {
          // Create connection between shapes
          if (connectionStart && connectionStart.id !== clickedShape.id) {
            const newConnection: Shape = {
              id: Date.now().toString(),
              type: "connection",
              startX: connectionStart.startX + (connectionStart.width ? connectionStart.width / 2 : 0),
              startY: connectionStart.startY + (connectionStart.height ? connectionStart.height / 2 : 0),
              endX: clickedShape.startX + (clickedShape.width ? clickedShape.width / 2 : 0),
              endY: clickedShape.startY + (clickedShape.height ? clickedShape.height / 2 : 0),
              color: currentColor,
              connectionType: connectionType,
              fromShape: connectionStart.id,
              toShape: clickedShape.id,
            }

            setShapes([...shapes, newConnection])
          }

          setIsConnecting(false)
          setConnectionStart(null)
        }
        return
      }

      setIsDragging(true)
      setDragOffset({
        x: x - pan.x - clickedShape.startX * zoom,
        y: y - pan.y - clickedShape.startY * zoom,
      })
      return
    }

    setLastPosition({ x: adjustedX, y: adjustedY })
    setIsDrawing(true)

    if (selectedTool === "text") {
      setTextPosition({ x: adjustedX, y: adjustedY })
      setShowTextInput(true)
      return
    }

    const newShape: Shape = {
      id: Date.now().toString(),
      type: selectedTool,
      startX: adjustedX,
      startY: adjustedY,
      color: currentColor,
      points: selectedTool === "freehand" ? [{ x: adjustedX, y: adjustedY }] : undefined,
      text: getDefaultText(selectedTool),
      connectionType: selectedTool === "connection" ? connectionType : undefined,
    }

    // Set default dimensions for system design components
    if (
      [
        "database",
        "server",
        "cloud",
        "cache",
        "loadBalancer",
        "user",
        "api",
        "microservice",
        "queue",
        "storage",
        "cdn",
        "firewall",
        "analytics",
        "mobile",
        "web",
        "container",
      ].includes(selectedTool)
    ) {
      switch (selectedTool) {
        case "database":
          newShape.width = 80
          newShape.height = 100
          break
        case "server":
          newShape.width = 70
          newShape.height = 100
          break
        case "cloud":
          newShape.width = 100
          newShape.height = 60
          break
        case "cache":
          newShape.width = 80
          newShape.height = 60
          break
        case "loadBalancer":
          newShape.width = 80
          newShape.height = 60
          break
        case "user":
          newShape.width = 50
          newShape.height = 80
          break
        case "api":
          newShape.width = 90
          newShape.height = 70
          break
        case "microservice":
          newShape.width = 80
          newShape.height = 80
          break
        case "queue":
          newShape.width = 100
          newShape.height = 50
          break
        case "storage":
          newShape.width = 80
          newShape.height = 90
          break
        case "cdn":
          newShape.width = 90
          newShape.height = 60
          break
        case "firewall":
          newShape.width = 70
          newShape.height = 80
          break
        case "analytics":
          newShape.width = 80
          newShape.height = 70
          break
        case "mobile":
          newShape.width = 50
          newShape.height = 90
          break
        case "web":
          newShape.width = 90
          newShape.height = 70
          break
        case "container":
          newShape.width = 80
          newShape.height = 80
          break
      }
    }

    setCurrentShape(newShape)
  }

  // Handling drawing or dragging actions
  const draw = (e: React.MouseEvent) => {
    if (!context || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Adjust for zoom and pan
    const adjustedX = (x - pan.x) / zoom
    const adjustedY = (y - pan.y) / zoom

    // Handle dragging
    if (isDragging && selectedShape) {
      const shapeIndex = shapes.findIndex((s) => s.id === selectedShape)
      if (shapeIndex !== -1) {
        const updatedShapes = [...shapes]
        const shape = { ...updatedShapes[shapeIndex] }

        // Update position
        const newX = (x - pan.x - dragOffset.x) / zoom
        const newY = (y - pan.y - dragOffset.y) / zoom

        if (shape.type === "freehand" && shape.points) {
          // For freehand, move all points
          const dx = newX - shape.startX
          const dy = newY - shape.startY

          const newPoints = shape.points.map((point) => ({
            x: point.x + dx,
            y: point.y + dy,
          }))

          shape.startX = newX
          shape.startY = newY
          shape.points = newPoints
        } else if (
          shape.endX !== undefined &&
          shape.endY !== undefined &&
          shape.type !== "arrow" &&
          shape.type !== "connection"
        ) {
          // For shapes with dimensions, maintain the same size
          const width = shape.endX - shape.startX
          const height = shape.endY - shape.startY
          shape.startX = newX
          shape.startY = newY
          shape.endX = newX + width
          shape.endY = newY + height
        } else if (
          (shape.type === "arrow" || shape.type === "connection") &&
          shape.endX !== undefined &&
          shape.endY !== undefined
        ) {
          // For arrows, move both points
          const dx = newX - shape.startX
          const dy = newY - shape.startY
          shape.startX = newX
          shape.startY = newY
          shape.endX += dx
          shape.endY += dy
        } else {
          // For other shapes (like system design components)
          shape.startX = newX
          shape.startY = newY
        }

        updatedShapes[shapeIndex] = shape

        // Update connections if this shape is connected
        updatedShapes.forEach((s, i) => {
          if (s.type === "connection") {
            if (s.fromShape === shape.id) {
              s.startX = shape.startX + (shape.width ? shape.width / 2 : 0)
              s.startY = shape.startY + (shape.height ? shape.height / 2 : 0)
            }
            if (s.toShape === shape.id) {
              s.endX = shape.startX + (shape.width ? shape.width / 2 : 0)
              s.endY = shape.startY + (shape.height ? shape.height / 2 : 0)
            }
          }
        })

        setShapes(updatedShapes)
        redrawCanvas()
      }
      return
    }

    if (!isDrawing) return

    if (selectedTool === "eraser") {
      // Find shapes to erase
      const shapeToErase = findShapeAtPosition(x, y)
      if (shapeToErase) {
        // Remove the shape and any connections to/from it
        setShapes(
          shapes.filter((s) => {
            if (s.id === shapeToErase.id) return false
            if (s.type === "connection" && (s.fromShape === shapeToErase.id || s.toShape === shapeToErase.id))
              return false
            return true
          }),
        )
        redrawCanvas()
      }
      return
    }

    if (!currentShape) return

    if (selectedTool === "freehand") {
      // Update points for freehand drawing
      const updatedShape = {
        ...currentShape,
        points: [...(currentShape.points || []), { x: adjustedX, y: adjustedY }],
      }

      setCurrentShape(updatedShape)

      // Draw the line segment
      context.save()
      context.translate(pan.x, pan.y)
      context.scale(zoom, zoom)
      context.beginPath()
      context.moveTo(lastPosition.x, lastPosition.y)
      context.lineTo(adjustedX, adjustedY)
      context.stroke()
      context.restore()
    } else if (
      [
        "database",
        "server",
        "cloud",
        "cache",
        "loadBalancer",
        "user",
        "api",
        "microservice",
        "queue",
        "storage",
        "cdn",
        "firewall",
        "analytics",
        "mobile",
        "web",
        "container",
      ].includes(selectedTool)
    ) {
      // For system design components, we don't resize while dragging
      // They have fixed sizes
    } else {
      // For other shapes, just update end coordinates
      const updatedShape = {
        ...currentShape,
        endX: adjustedX,
        endY: adjustedY,
      }

      setCurrentShape(updatedShape)

      // Redraw canvas to show the shape in progress
      redrawCanvas()
      drawShape(updatedShape)
    }

    setLastPosition({ x: adjustedX, y: adjustedY })
  }

  // Finish drawing or dragging
  const stopDrawing = () => {
    if (isDrawing && currentShape) {
      // For system design components, add them directly
      if (
        [
          "database",
          "server",
          "cloud",
          "cache",
          "loadBalancer",
          "user",
          "api",
          "microservice",
          "queue",
          "storage",
          "cdn",
          "firewall",
          "analytics",
          "mobile",
          "web",
          "container",
        ].includes(currentShape.type)
      ) {
        setShapes([...shapes, currentShape])
      }
      // For other shapes, only add if they have valid dimensions
      else if (
        currentShape.type === "freehand" ||
        (currentShape.endX !== undefined && currentShape.endY !== undefined)
      ) {
        setShapes([...shapes, currentShape])
      }

      setCurrentShape(null)
    }

    setIsDrawing(false)
    setIsDragging(false)
    setSelectedShape(null)
  }

  // Handle text input submission
  const handleTextSubmit = () => {
    if (textInput.trim() !== "") {
      const newTextShape: Shape = {
        id: Date.now().toString(),
        type: "text",
        startX: textPosition.x,
        startY: textPosition.y,
        text: textInput,
        color: currentColor,
      }

      setShapes([...shapes, newTextShape])
      setTextInput("")
      setShowTextInput(false)
      redrawCanvas()
    } else {
      setShowTextInput(false)
    }
  }

  // Clear all shapes from the canvas
  const clearCanvas = () => {
    if (!context || !canvasRef.current) return
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    setShapes([])
  }

  // Export whiteboard data
  const exportWhiteboardData = () => {
    return JSON.stringify({
      shapes,
      zoom,
      pan,
    })
  }

  // Import whiteboard data
  const importWhiteboardData = (data: string) => {
    try {
      const parsedData = JSON.parse(data)
      if (parsedData.shapes) {
        setShapes(parsedData.shapes)

        // Import zoom and pan if available
        if (parsedData.zoom) setZoom(parsedData.zoom)
        if (parsedData.pan) setPan(parsedData.pan)

        redrawCanvas()
        return true
      }
      return false
    } catch (error) {
      console.error("Failed to import whiteboard data:", error)
      return false
    }
  }

  // Stream simulation - adds shapes one by one with a delay
  const streamWhiteboardData = (data: string, delayMs = 200) => {
    try {
      const parsedData = JSON.parse(data)
      if (!parsedData.shapes) return false

      // Clear existing shapes
      setShapes([])

      // Import zoom and pan if available
      if (parsedData.zoom) setZoom(parsedData.zoom)
      if (parsedData.pan) setPan(parsedData.pan)

      // Add shapes one by one with delay
      parsedData.shapes.forEach((shape: Shape, index: number) => {
        setTimeout(() => {
          setShapes((prevShapes) => [...prevShapes, shape])
        }, index * delayMs)
      })

      return true
    } catch (error) {
      console.error("Failed to stream whiteboard data:", error)
      return false
    }
  }

  // Handle zoom
  const handleZoom = (delta: number) => {
    setZoom((prevZoom) => {
      const newZoom = prevZoom + delta
      return Math.max(0.5, Math.min(3, newZoom)) // Limit zoom between 0.5 and 3
    })
  }

  // Handle wheel event for zooming
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      handleZoom(delta)
    } else if (e.shiftKey) {
      // Pan horizontally with shift+wheel
      setPan((prevPan) => ({
        x: prevPan.x - e.deltaY,
        y: prevPan.y,
      }))
    } else {
      // Pan vertically with wheel
      setPan((prevPan) => ({
        x: prevPan.x,
        y: prevPan.y - e.deltaY,
      }))
    }
  }

  // Toggle grid visibility
  const toggleGrid = () => {
    setGridVisible(!gridVisible)
  }

  // Reset zoom and pan
  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  // Delete selected shape
  const deleteSelected = () => {
    if (selectedShape) {
      setShapes(
        shapes.filter((s) => {
          if (s.id === selectedShape) return false
          if (s.type === "connection" && (s.fromShape === selectedShape || s.toShape === selectedShape)) return false
          return true
        }),
      )
      setSelectedShape(null)
    }
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedShape && !showTextInput) {
          deleteSelected()
        }
      } else if (e.key === "Escape") {
        if (isConnecting) {
          setIsConnecting(false)
          setConnectionStart(null)
        } else if (showTextInput) {
          setShowTextInput(false)
          setTextInput("")
        } else {
          setSelectedShape(null)
        }
      } else if (e.ctrlKey && e.key === "0") {
        e.preventDefault()
        resetView()
      } else if (e.ctrlKey && e.key === "+") {
        e.preventDefault()
        handleZoom(0.1)
      } else if (e.ctrlKey && e.key === "-") {
        e.preventDefault()
        handleZoom(-0.1)
      } else if (e.ctrlKey && e.key === "g") {
        e.preventDefault()
        toggleGrid()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectedShape, showTextInput, isConnecting, shapes])

  // Pass the functions to parent component via callbacks
  useEffect(() => {
    if (onExport) {
      onExport(exportWhiteboardData)
    }
    if (onImport) {
      onImport(importWhiteboardData)
    }
    if (onStream) {
      onStream(streamWhiteboardData)
    }
  }, [shapes, onExport, onImport, onStream, zoom, pan])

  return (
    <div
      className="relative flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 rounded-2xl shadow-2xl overflow-hidden border border-indigo-100/50"
      style={{ width, height, maxHeight: height }}
    >
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/70 backdrop-blur-md border-b border-indigo-100 shadow-sm px-4 py-3">
        <ToolBar
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
          onClear={clearCanvas}
          connectionType={connectionType}
          setConnectionType={setConnectionType}
          gridVisible={gridVisible}
          toggleGrid={toggleGrid}
          zoom={zoom}
          handleZoom={handleZoom}
          resetView={resetView}
          isConnecting={isConnecting}
          connectionStart={connectionStart}
        />
      </div>

      <div className="flex-1 p-4 pt-20 overflow-hidden" style={{ height: "calc(100% - 20px)" }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onWheel={handleWheel}
          className="w-full h-full bg-white rounded-xl shadow-lg border border-indigo-100/50 transition-all duration-300 cursor-crosshair"
          style={{ maxHeight: "100%" }}
        />
      </div>

      {showTextInput && (
        <TextInputOverlay
          position={{
            x: textPosition.x * zoom + pan.x,
            y: textPosition.y * zoom + pan.y,
          }}
          value={textInput}
          onChange={setTextInput}
          onSubmit={handleTextSubmit}
        />
      )}

      {isConnecting && connectionStart && (
        <div className="fixed top-0 left-0 right-0 bg-indigo-600 text-white py-2 px-4 text-center z-50">
          Select a target component to connect to. Press ESC to cancel.
        </div>
      )}

      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => handleZoom(-0.1)}
          className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          title="Zoom out"
        >
          -
        </button>
        <div className="bg-white rounded-full px-3 py-1 shadow-md flex items-center justify-center text-sm font-medium">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={() => handleZoom(0.1)}
          className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={resetView}
          className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          title="Reset view"
        >
          ↺
        </button>
      </div>
    </div>
  )
}

export default Whiteboard

