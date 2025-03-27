"use client"

import { Text, Title, SimpleGrid } from "@mantine/core"

export default function TextPanel({ onAddMedia }) {
  const textStyles = [
    { id: "headline", label: "Headline Title", style: { fontSize: 24, fontWeight: "bold" } },
    { id: "simple", label: "Simple", style: { fontSize: 16 } },
    { id: "handwriting", label: "Handwriting", style: { fontSize: 16, fontFamily: "cursive" } },
    { id: "serif", label: "Serif", style: { fontSize: 16, fontFamily: "serif" } },
    { id: "typewriter", label: "Typewriter", style: { fontSize: 16, fontFamily: "monospace" } },
    { id: "headline-subcopy", label: "Add a headline", style: { fontSize: 24, fontWeight: "bold" } },
    { id: "expert-insights", label: "EXPERT INSIGHTS", style: { fontSize: 24, fontWeight: "bold", letterSpacing: 1 } },
  ]

  const handleAddText = (style) => {
    onAddMedia({
      type: "text",
      src: `/placeholder.svg?height=60&width=200&text=${style.label}`,
      style,
    })
  }

  return (
    <div>
      <Title order={4} mb={15}>
        Add Text
      </Title>

      <div
        className="element-item"
        style={{ padding: 20, marginBottom: 20 }}
        onClick={() => handleAddText(textStyles[0])}
      >
        <Text style={textStyles[0].style}>Headline Title</Text>
      </div>

      <SimpleGrid cols={2} spacing={10}>
        <div className="element-item" style={{ padding: 20 }} onClick={() => handleAddText(textStyles[1])}>
          <Text style={textStyles[1].style}>Simple</Text>
        </div>

        <div className="element-item" style={{ padding: 20 }} onClick={() => handleAddText(textStyles[2])}>
          <Text style={textStyles[2].style}>Handwriting</Text>
        </div>

        <div className="element-item" style={{ padding: 20 }} onClick={() => handleAddText(textStyles[3])}>
          <Text style={textStyles[3].style}>Serif</Text>
        </div>

        <div className="element-item" style={{ padding: 20 }} onClick={() => handleAddText(textStyles[4])}>
          <Text style={textStyles[4].style}>Typewriter</Text>
        </div>

        <div className="element-item" style={{ padding: 20 }} onClick={() => handleAddText(textStyles[5])}>
          <div>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Add a headline</Text>
            <Text size="xs" color="dimmed">
              Add a subcopy
            </Text>
          </div>
        </div>

        <div className="element-item" style={{ padding: 20 }} onClick={() => handleAddText(textStyles[6])}>
          <div>
            <Text style={{ fontSize: 20, fontWeight: "bold", letterSpacing: 1 }}>EXPERT INSIGHTS</Text>
            <Text size="xs" color="dimmed">
              ADD YOUR HEADLINE HERE
            </Text>
          </div>
        </div>
      </SimpleGrid>
    </div>
  )
}

