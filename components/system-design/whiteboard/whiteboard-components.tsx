"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import type { Shape, ShapeType, ConnectionType } from "../types"
import {
  Pencil,
  Square,
  Circle,
  ArrowRight,
  Type,
  Database,
  Server,
  Cloud,
  Cpu,
  BarChart3,
  User,
  Eraser,
  Trash2,
  X,
  Check,
  Grid,
  Globe,
  Layers,
  HardDrive,
  Network,
  Shield,
  BarChart,
  Smartphone,
  Monitor,
  Box,
  GitBranch,
  GitCommit,
} from "lucide-react"

interface ToolBarProps {
  selectedTool: ShapeType
  setSelectedTool: (tool: ShapeType) => void
  currentColor: string
  setCurrentColor: (color: string) => void
  onClear: () => void
  connectionType: ConnectionType
  setConnectionType: (type: ConnectionType) => void
  gridVisible: boolean
  toggleGrid: () => void
  zoom: number
  handleZoom: (delta: number) => void
  resetView: () => void
  isConnecting: boolean
  connectionStart: Shape | null
}

export const ToolBar: React.FC<ToolBarProps> = ({
  selectedTool,
  setSelectedTool,
  currentColor,
  setCurrentColor,
  onClear,
  connectionType,
  setConnectionType,
  gridVisible,
  toggleGrid,
  zoom,
  handleZoom,
  resetView,
  isConnecting,
  connectionStart,
}) => {
  const [activeTab, setActiveTab] = useState<"draw" | "system" | "connect">("draw")

  const drawingTools = [
    { type: "freehand" as ShapeType, icon: <Pencil className="w-5 h-5" />, label: "Pen" },
    { type: "rectangle" as ShapeType, icon: <Square className="w-5 h-5" />, label: "Rectangle" },
    { type: "circle" as ShapeType, icon: <Circle className="w-5 h-5" />, label: "Circle" },
    { type: "arrow" as ShapeType, icon: <ArrowRight className="w-5 h-5" />, label: "Arrow" },
    { type: "text" as ShapeType, icon: <Type className="w-5 h-5" />, label: "Text" },
    { type: "eraser" as ShapeType, icon: <Eraser className="w-5 h-5" />, label: "Eraser" },
  ]

  const systemTools = [
    { type: "database" as ShapeType, icon: <Database className="w-5 h-5" />, label: "Database" },
    { type: "server" as ShapeType, icon: <Server className="w-5 h-5" />, label: "Server" },
    { type: "cloud" as ShapeType, icon: <Cloud className="w-5 h-5" />, label: "Cloud" },
    { type: "cache" as ShapeType, icon: <Cpu className="w-5 h-5" />, label: "Cache" },
    { type: "loadBalancer" as ShapeType, icon: <BarChart3 className="w-5 h-5" />, label: "Load Balancer" },
    { type: "user" as ShapeType, icon: <User className="w-5 h-5" />, label: "User" },
    { type: "api" as ShapeType, icon: <Globe className="w-5 h-5" />, label: "API Gateway" },
    { type: "microservice" as ShapeType, icon: <Layers className="w-5 h-5" />, label: "Microservice" },
    { type: "queue" as ShapeType, icon: <GitBranch className="w-5 h-5" />, label: "Message Queue" },
    { type: "storage" as ShapeType, icon: <HardDrive className="w-5 h-5" />, label: "Storage" },
    { type: "cdn" as ShapeType, icon: <Network className="w-5 h-5" />, label: "CDN" },
    { type: "firewall" as ShapeType, icon: <Shield className="w-5 h-5" />, label: "Firewall" },
    { type: "analytics" as ShapeType, icon: <BarChart className="w-5 h-5" />, label: "Analytics" },
    { type: "mobile" as ShapeType, icon: <Smartphone className="w-5 h-5" />, label: "Mobile App" },
    { type: "web" as ShapeType, icon: <Monitor className="w-5 h-5" />, label: "Web App" },
    { type: "container" as ShapeType, icon: <Box className="w-5 h-5" />, label: "Container" },
  ]

  const connectionTools = [
    { type: "connection" as ShapeType, icon: <GitCommit className="w-5 h-5" />, label: "Connect Components" },
  ]

  const connectionTypes = [
    { type: "solid" as ConnectionType, label: "Solid Line" },
    { type: "dashed" as ConnectionType, label: "Dashed Line" },
    { type: "dotted" as ConnectionType, label: "Dotted Line" },
  ]

  const colors = [
    "#6366f1", // Indigo
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#ef4444", // Red
    "#f97316", // Orange
    "#eab308", // Yellow
    "#22c55e", // Green
    "#06b6d4", // Cyan
    "#3b82f6", // Blue
    "#000000", // Black
  ]

  const [showColorPicker, setShowColorPicker] = useState(false)
  const colorPickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("draw")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "draw" ? "bg-indigo-100 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Drawing
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "system" ? "bg-indigo-100 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            System Design
          </button>
          <button
            onClick={() => setActiveTab("connect")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "connect" ? "bg-indigo-100 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Connections
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleGrid}
            className={`p-2 rounded-lg transition-colors ${
              gridVisible ? "bg-indigo-100 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
            }`}
            title={gridVisible ? "Hide Grid" : "Show Grid"}
          >
            <Grid className="w-5 h-5" />
          </button>

          <div className="relative" ref={colorPickerRef}>
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-8 h-8 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: currentColor }}
              title="Color picker"
            />

            {showColorPicker && (
              <div className="absolute right-0 top-full mt-2 p-2 bg-white rounded-lg shadow-xl border border-slate-200 grid grid-cols-5 gap-1 z-50">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setCurrentColor(color)
                      setShowColorPicker(false)
                    }}
                    className="w-6 h-6 rounded-full border border-slate-200 transition-transform hover:scale-110"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onClear}
            className="flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Clear canvas"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1 md:gap-2">
        {activeTab === "draw" &&
          drawingTools.map((tool) => (
            <button
              key={tool.type}
              onClick={() => setSelectedTool(tool.type)}
              className={`relative group flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                selectedTool === tool.type
                  ? "bg-indigo-100 text-indigo-600 shadow-sm"
                  : "hover:bg-indigo-50 text-slate-700 hover:text-indigo-600"
              }`}
              title={tool.label}
            >
              {tool.icon}
              <span className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
                {tool.label}
              </span>
            </button>
          ))}

        {activeTab === "system" &&
          systemTools.map((tool) => (
            <button
              key={tool.type}
              onClick={() => setSelectedTool(tool.type)}
              className={`relative group flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                selectedTool === tool.type
                  ? "bg-indigo-100 text-indigo-600 shadow-sm"
                  : "hover:bg-indigo-50 text-slate-700 hover:text-indigo-600"
              }`}
              title={tool.label}
            >
              {tool.icon}
              <span className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
                {tool.label}
              </span>
            </button>
          ))}

        {activeTab === "connect" && (
          <>
            {connectionTools.map((tool) => (
              <button
                key={tool.type}
                onClick={() => setSelectedTool(tool.type)}
                className={`relative group flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                  selectedTool === tool.type
                    ? "bg-indigo-100 text-indigo-600 shadow-sm"
                    : "hover:bg-indigo-50 text-slate-700 hover:text-indigo-600"
                }`}
                title={tool.label}
              >
                {tool.icon}
                <span className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
                  {tool.label}
                </span>
              </button>
            ))}

            <div className="h-6 border-l border-slate-200 mx-2"></div>

            {connectionTypes.map((type) => (
              <button
                key={type.type}
                onClick={() => setConnectionType(type.type)}
                className={`relative group flex items-center justify-center px-3 py-1 rounded-lg transition-all duration-200 text-sm ${
                  connectionType === type.type
                    ? "bg-indigo-100 text-indigo-600 shadow-sm"
                    : "hover:bg-indigo-50 text-slate-700 hover:text-indigo-600"
                }`}
                title={type.label}
              >
                {type.label}
              </button>
            ))}

            {isConnecting && connectionStart && (
              <div className="ml-4 text-sm text-indigo-600 font-medium flex items-center">
                <GitCommit className="w-4 h-4 mr-1" />
                Connecting from: {connectionStart.text || connectionStart.type}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

interface TextInputOverlayProps {
  position: { x: number; y: number }
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export const TextInputOverlay: React.FC<TextInputOverlayProps> = ({ position, value, onChange, onSubmit }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSubmit()
    } else if (e.key === "Escape") {
      onChange("")
      onSubmit()
    }
  }

  return (
    <div
      className="absolute z-20 flex items-center bg-white rounded-lg shadow-lg border border-indigo-200 overflow-hidden"
      style={{
        left: position.x,
        top: position.y - 40,
      }}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="px-3 py-2 outline-none border-none bg-transparent text-slate-800 min-w-[200px]"
        placeholder="Enter text..."
      />
      <div className="flex border-l border-slate-200">
        <button
          onClick={() => {
            onChange("")
            onSubmit()
          }}
          className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <button
          onClick={onSubmit}
          className="p-2 text-slate-500 hover:text-green-500 hover:bg-green-50 transition-colors"
        >
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

