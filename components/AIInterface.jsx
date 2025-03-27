"use client"

import { useState } from "react"
import { TextInput, Button, Group, Title, Text, Paper, SimpleGrid, ActionIcon } from "@mantine/core"
import { IconArrowLeft, IconBrandOpenai, IconArrowRight } from "@tabler/icons-react"

export default function AIInterface({ onComplete }) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState(null)

  const handleGoBack = () => {
    onComplete(null)
  }

  const examplePrompts = ["Product announcement", "Surfing for beginners", "Sales update", "Company introduction"]

  const handleGenerateVideo = () => {
    if (!prompt) return

    setIsGenerating(true)

    setTimeout(() => {
      setIsGenerating(false)
      setGeneratedContent({
        type: "video",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        name: `AI Generated: ${prompt}`,
      })
    }, 3000)
  }

  const handleUseGenerated = () => {
    if (generatedContent) {
      onComplete(generatedContent)
    }
  }

  const handleTryAgain = () => {
    setGeneratedContent(null)
  }

  const handleExampleClick = (example) => {
    setPrompt(example)
  }

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <Group mb={30}>
        <ActionIcon onClick={handleGoBack} variant="subtle">
          <IconArrowLeft size={24} />
        </ActionIcon>
        <Title order={3}>Start with AI</Title>
      </Group>

      {!generatedContent ? (
        <>
          <Paper withBorder p={30} mb={30}>
            <Group position="apart" mb={20}>
              <IconBrandOpenai size={32} color="#4C6EF5" />
              <Text size="lg" weight={500}>
                Make me a video about...
              </Text>
            </Group>

            <TextInput
              placeholder="Describe what you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              size="lg"
              rightSection={
                <Button
                  color="indigo"
                  disabled={!prompt || isGenerating}
                  onClick={handleGenerateVideo}
                  rightSection={<IconArrowRight size={16} />}
                >
                  {isGenerating ? "Generating..." : "Generate Video"}
                </Button>
              }
              rightSectionWidth={150}
              mb={20}
            />

            <Text size="sm" color="dimmed" mb={15}>
              Try an example...
            </Text>

            <Group>
              {examplePrompts.map((example, index) => (
                <Button key={index} variant="light" color="gray" onClick={() => handleExampleClick(example)}>
                  {example}
                </Button>
              ))}
            </Group>
          </Paper>

          <Title order={4} mb={20}>
            Popular AI Templates
          </Title>

          <SimpleGrid cols={3} spacing="lg">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Paper key={i} withBorder p={15} style={{ cursor: "pointer" }}>
                <div style={{ height: "120px", background: "#f1f3f5", borderRadius: "4px", marginBottom: "10px" }} />
                <Text weight={500}>Template {i}</Text>
                <Text size="xs" color="dimmed">
                  AI-powered template
                </Text>
              </Paper>
            ))}
          </SimpleGrid>
        </>
      ) : (
        <div>
          <div
            style={{
              width: "100%",
              height: "400px",
              background: "#000",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
              overflow: "hidden",
            }}
          >
            <video
              src={generatedContent.src}
              controls
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>

          <Group position="center">
            <Button variant="outline" onClick={handleTryAgain}>
              Try Another Prompt
            </Button>
            <Button color="indigo" onClick={handleUseGenerated}>
              Use This Video
            </Button>
          </Group>
        </div>
      )}
    </div>
  )
}

