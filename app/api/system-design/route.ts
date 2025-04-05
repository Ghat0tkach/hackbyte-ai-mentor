import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

// Define Zod schemas for validation
const PointSchema = z.object({
  x: z.number().describe("X coordinate of a point"),
  y: z.number().describe("Y coordinate of a point"),
});

const ShapeSchema = z.object({
  id: z.string().describe("Unique identifier for the shape, typically a timestamp"),
  type: z.enum([
    'circle', 'rectangle', 'arrow', 'text', 'freehand', 
    'database', 'server', 'cloud', 'cache', 'loadBalancer', 
    'user', 'api', 'microservice', 'queue', 'storage', 
    'cdn', 'firewall', 'analytics', 'mobile', 'web', 'container',
    'connection'
  ]).describe("Type of shape to render"),
  startX: z.number().describe("Starting X coordinate"),
  startY: z.number().describe("Starting Y coordinate"),
  color: z.string().describe("Color of the shape in hex format"),
  text: z.string().optional().describe("Label text for the shape"),
  endX: z.number().optional().describe("Ending X coordinate for shapes with dimensions"),
  endY: z.number().optional().describe("Ending Y coordinate for shapes with dimensions"),
  width: z.number().optional().describe("Width of the shape"),
  height: z.number().optional().describe("Height of the shape"),
  points: z.array(PointSchema).optional().describe("Array of points for freehand drawing"),
  connectionType: z.enum(['solid', 'dashed', 'dotted']).optional().describe("Type of connection line"),
  fromShape: z.string().optional().describe("ID of the shape where connection starts"),
  toShape: z.string().optional().describe("ID of the shape where connection ends"),
});

const DiagramSchema = z.object({
  shapes: z.array(ShapeSchema).describe("Array of shapes in the diagram"),
  zoom: z.number().default(1).describe("Zoom level of the diagram"),
  pan: z.object({
    x: z.number().default(0).describe("X coordinate of the pan position"),
    y: z.number().default(0).describe("Y coordinate of the pan position"),
  }).describe("Pan position of the diagram"),
});

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();
    console.log("Received question:", question);
    
    // Generate diagram using Vercel AI SDK
    try {
      const { object: diagramData } = await generateObject({
        model: google('gemini-1.5-pro', {
          structuredOutputs: false,
        }),
        schema: DiagramSchema,
        prompt: `
          You are a system design expert tasked with creating a visual diagram for the following question:
          "${question}"
          
          STRICTLY USE TO SOLVE THIS QUESTION:
          - Use the provided components and relationships to create a visual diagram
          - Ensure all components are clearly labeled and distinguishable
          - Use appropriate shapes and connections to represent the relationships
          - Avoid overlapping components or elements
          Consider the following components and relationships:
          - Users (type: "user")
          - Web/Mobile frontends (type: "web" or "mobile")
          - API Gateways (type: "api")
          - Load Balancers (type: "loadBalancer")
          - Application Servers (type: "server")
          - Databases (type: "database")
          - Caches (type: "cache")
          - Message Queues (type: "queue")
          - Cloud Services (type: "cloud")
          - Microservices (type: "microservice")
          - Storage Systems (type: "storage")
          - CDNs (type: "cdn")

          For connections between components:
          - Use "solid" connections for primary data flow
          - Use "dashed" connections for secondary or optional flows
          - Use "dotted" connections for background processes
          
          How would you approach drawing a diagram for this system design question?
          
          Generate a JSON data structure for a whiteboard diagram based on your approach.
          Position all elements in the center of the canvas, roughly between coordinates (100,100) and (700,500).
          Generate realistic coordinates and make sure all required properties are included for each shape type.
          
          For each shape:
          - Use appropriate colors (e.g., #6366f1 for primary elements, #10b981 for databases, #f59e0b for users)
          - Ensure text labels are descriptive but concise
          - Position elements logically with proper spacing
          - Use connections to show relationships between components
          
          Here's an example of a well-structured diagram for a URL shortener service:
          {
            "shapes": [
              {
                "id": "1687452390123",
                "type": "user",
                "startX": 150,
                "startY": 200,
                "color": "#f59e0b",
                "text": "User",
                "width": 50,
                "height": 80
              },
              {
                "id": "1687452390124",
                "type": "web",
                "startX": 300,
                "startY": 200,
                "color": "#6366f1",
                "text": "Web Frontend",
                "width": 90,
                "height": 70
              },
              {
                "id": "1687452390125",
                "type": "api",
                "startX": 450,
                "startY": 200,
                "color": "#8b5cf6",
                "text": "API Gateway",
                "width": 90,
                "height": 70
              },
              {
                "id": "1687452390126",
                "type": "server",
                "startX": 600,
                "startY": 200,
                "color": "#3b82f6",
                "text": "Application Server",
                "width": 70,
                "height": 100
              },
              {
                "id": "1687452390127",
                "type": "database",
                "startX": 600,
                "startY": 350,
                "color": "#10b981",
                "text": "URL Database",
                "width": 80,
                "height": 100
              },
              {
                "id": "1687452390128",
                "type": "cache",
                "startX": 450,
                "startY": 350,
                "color": "#06b6d4",
                "text": "Redis Cache",
                "width": 80,
                "height": 60
              },
              {
                "id": "1687452390129",
                "type": "connection",
                "startX": 175,
                "startY": 240,
                "endX": 300,
                "endY": 235,
                "color": "#6b7280",
                "connectionType": "solid",
                "fromShape": "1687452390123",
                "toShape": "1687452390124"
              },
              {
                "id": "1687452390130",
                "type": "connection",
                "startX": 345,
                "startY": 235,
                "endX": 450,
                "endY": 235,
                "color": "#6b7280",
                "connectionType": "solid",
                "fromShape": "1687452390124",
                "toShape": "1687452390125"
              },
              {
                "id": "1687452390131",
                "type": "connection",
                "startX": 495,
                "startY": 235,
                "endX": 600,
                "endY": 235,
                "color": "#6b7280",
                "connectionType": "solid",
                "fromShape": "1687452390125",
                "toShape": "1687452390126"
              },
              {
                "id": "1687452390132",
                "type": "connection",
                "startX": 635,
                "startY": 250,
                "endX": 635,
                "endY": 350,
                "color": "#6b7280",
                "connectionType": "solid",
                "fromShape": "1687452390126",
                "toShape": "1687452390127"
              },
              {
                "id": "1687452390133",
                "type": "connection",
                "startX": 600,
                "startY": 235,
                "endX": 490,
                "endY": 350,
                "color": "#6b7280",
                "connectionType": "dashed",
                "fromShape": "1687452390126",
                "toShape": "1687452390128"
              }
            ],
            "zoom": 1,
            "pan": {
              "x": 0,
              "y": 0
            }
          }
          
          Make sure to include appropriate components based on the system design question. Common components include:
          - Users (type: "user")
          - Web/Mobile frontends (type: "web" or "mobile")
          - API Gateways (type: "api")
          - Load Balancers (type: "loadBalancer")
          - Application Servers (type: "server")
          - Databases (type: "database")
          - Caches (type: "cache")
          - Message Queues (type: "queue")
          - Cloud Services (type: "cloud")
          - Microservices (type: "microservice")
          - Storage Systems (type: "storage")
          - CDNs (type: "cdn")
          
          For connections between components:
          - Use "solid" connections for primary data flow
          - Use "dashed" connections for secondary or optional flows
          - Use "dotted" connections for background processes
          
          Return ONLY the JSON without any explanations or markdown.
        `,
        maxTokens: 2000,
        temperature: 0.2,
      });
      
      console.log("Generated Diagram Data:", diagramData);
      // Post-process the diagram data to ensure proper positioning
      const processedData = postProcessDiagram(diagramData);
      
      // Return the processed diagram data
      return NextResponse.json(processedData);
    } catch (error) {
      console.error("Error generating diagram:", error);
      return NextResponse.json({ 
        error: "Failed to generate diagram", 
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

// Helper function to post-process the diagram data
function postProcessDiagram(diagramData: any) {
  // Ensure all shapes have proper coordinates in the center of the canvas
  if (diagramData.shapes) {
    diagramData.shapes = diagramData.shapes.map((shape: any) => {
      // Ensure startX and startY are within reasonable bounds
      shape.startX = Math.max(100, Math.min(700, shape.startX || 300));
      shape.startY = Math.max(100, Math.min(500, shape.startY || 300));
      
      // If endX/endY exist, ensure they're also within bounds
      if (shape.endX !== undefined) {
        shape.endX = Math.max(100, Math.min(700, shape.endX));
      }
      if (shape.endY !== undefined) {
        shape.endY = Math.max(100, Math.min(500, shape.endY));
      }
      
      // Ensure each shape has an id
      if (!shape.id) {
        shape.id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      }
      
      // Ensure each shape has a color
      if (!shape.color) {
        shape.color = "#6366f1";
      }
      
      return shape;
    });
  }
  
  // Ensure zoom and pan are set
  diagramData.zoom = diagramData.zoom || 1;
  diagramData.pan = diagramData.pan || { x: 0, y: 0 };
  
  return diagramData;
}