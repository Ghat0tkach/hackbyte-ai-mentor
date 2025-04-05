"use client"

import { Editor, type EditorProps } from "@monaco-editor/react"
interface MonacoEditorProps {
  language: string
  value: string
  onChange?: (value: string | undefined) => void
  options?: EditorProps["options"]
}

export default function MonacoEditor({ language, value, onChange, options = {} }: MonacoEditorProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      language={language}
      value={value}
      theme="vs-dark"
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: "on",
        ...options,
      }}
      beforeMount={(monaco) => {
        monaco.editor.defineTheme("leetcode-dark", {
          base: "vs-dark",
          inherit: true,
          rules: [],
          colors: {
            "editor.background": "#1e1e1e",
            "editor.foreground": "#d4d4d4",
            "editorLineNumber.foreground": "#6e6e6e",
            "editorLineNumber.activeForeground": "#c6c6c6",
            "editor.selectionBackground": "#264f78",
            "editor.inactiveSelectionBackground": "#3a3d41",
            "editorCursor.foreground": "#aeafad",
          },
        })
      }}
    />
  )
}

