export interface SystemDesignQuestion {
    id: string
    shortTitle: string
    title: string
    difficulty: "Easy" | "Medium" | "Hard"
    timeEstimate: string
    complexity: string
    description: string[]
    requirements?: string[]
    constraints?: string[]
    hints?: string[]
    solution?: {
      approach: string[]
      components: string[]
      considerations?: string[]
    }
  }
  export type ShapeType =
  | "freehand"
  | "rectangle"
  | "circle"
  | "arrow"
  | "text"
  | "database"
  | "server"
  | "cloud"
  | "cache"
  | "loadBalancer"
  | "user"
  | "eraser"
  | "api"
  | "microservice"
  | "queue"
  | "storage"
  | "cdn"
  | "firewall"
  | "analytics"
  | "mobile"
  | "web"
  | "container"
  | "connection"

export type ConnectionType = "solid" | "dashed" | "dotted"

export interface Point {
  x: number
  y: number
}

export interface Shape {
  id: string
  type: ShapeType
  startX: number
  startY: number
  endX?: number
  endY?: number
  points?: Point[]
  color: string
  text?: string
  width?: number
  height?: number
  connectionType?: ConnectionType
  fromShape?: string
  toShape?: string
}

export interface WhiteboardProps {
  width?: string | number
  height?: string | number
  onExport?: (exportFn: () => string) => void
  onImport?: (importFn: (data: string) => boolean) => void
  onStream?: (streamFn: (data: string, delayMs?: number) => boolean) => void
}


  
  