"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react"
import type { CatalogEntry } from "@/lib/component-catalog"

interface PropRow {
  name: string
  type: string
  default?: string
  description: string
}

interface ComponentDocProps {
  entry: CatalogEntry
  props?: PropRow[]
  example?: string
  children: React.ReactNode
}

export type { PropRow }

export function ComponentDoc({ entry, props, example, children }: ComponentDocProps) {
  const [showProps, setShowProps] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyExample = () => {
    if (example) {
      navigator.clipboard.writeText(example)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <section
      id={entry.slug}
      aria-labelledby={`${entry.slug}-title`}
      className="scroll-mt-20 rounded-lg border bg-card p-6 space-y-4"
    >
      <div>
        <h3 id={`${entry.slug}-title`} className="text-lg font-semibold">
          {entry.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{entry.description}</p>
        <p className="text-xs text-muted-foreground/70 mt-0.5 italic">
          {entry.whenToUse}
        </p>
      </div>

      {/* Live demo */}
      <div className="rounded-md border p-4 bg-background">{children}</div>

      {/* Props table toggle */}
      {props && props.length > 0 && (
        <div>
          <button
            onClick={() => setShowProps(!showProps)}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {showProps ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
            Props ({props.length})
          </button>
          {showProps && (
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-1 pr-4">Name</th>
                  <th className="py-1 pr-4">Type</th>
                  <th className="py-1 pr-4">Default</th>
                  <th className="py-1">Description</th>
                </tr>
              </thead>
              <tbody>
                {props.map((p) => (
                  <tr key={p.name} className="border-b border-border/50">
                    <td className="py-1 pr-4 font-mono text-xs">{p.name}</td>
                    <td className="py-1 pr-4 font-mono text-xs text-muted-foreground">
                      {p.type}
                    </td>
                    <td className="py-1 pr-4 text-xs">{p.default ?? "—"}</td>
                    <td className="py-1 text-xs text-muted-foreground">
                      {p.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Code example */}
      {example && (
        <div className="relative">
          <button
            onClick={copyExample}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
          </button>
          <pre className="rounded-md bg-muted p-3 text-xs overflow-x-auto">
            <code>{example}</code>
          </pre>
        </div>
      )}
    </section>
  )
}
