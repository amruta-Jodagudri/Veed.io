"use client"
import { useState, useRef, useEffect } from "react"
import { Button, Text, Group, Paper, Stack, Title, Box } from "@mantine/core"
import { IconUpload, IconVideo, IconRobot } from "@tabler/icons-react"

export default function WelcomeModal({ onStart }) {
  const [step, setStep] = useState(1)
  const fileInputRef = useRef(null)
  const isMounted = useRef(false)

  const handleAcceptTerms = () => {
    setStep(2)
  }

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleFileUpload = () => {
    if (!fileInputRef.current) {
      const fileInput = document.createElement("input")
      fileInput.type = "file"
      fileInput.accept = "video/*,image/*,audio/*"
      fileInput.style.display = "none"
      fileInputRef.current = fileInput

      fileInput.addEventListener("change", (e) => {
        if (!isMounted.current) return
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0]
          onStart("upload", file)
          e.target.value = ""
        }
      })

      document.body.appendChild(fileInput)
    }

    const clickHandler = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click()
      }
    }

    setTimeout(clickHandler, 0)
  }

  useEffect(() => {
    return () => {
      if (fileInputRef.current) {
        document.body.removeChild(fileInputRef.current)
        fileInputRef.current = null
      }
    }
  }, [])

  return (
    <>
      {step === 1 && (
        <div className="welcome-modal">
          <div className="welcome-modal-content">
            <Box mb={20} style={{ textAlign: "center" }}>
              <img src="/placeholder.png?height=60&width=60" alt="Terms and Conditions" style={{ marginBottom: 20 }} />
              <Title order={3}>Terms and Conditions</Title>
              <Text size="sm" mt={10} color="dimmed">
                To continue using VEED, please agree to our{" "}
                <Text component="span" color="blue" style={{ cursor: "pointer" }}>
                  Terms
                </Text>{" "}
                and confirm you acknowledge our{" "}
                <Text component="span" color="blue" style={{ cursor: "pointer" }}>
                  Privacy Policy
                </Text>
              </Text>
            </Box>
            <Button fullWidth color="indigo" onClick={handleAcceptTerms}>
              Accept and Continue
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="welcome-modal">
          <div className="welcome-modal-content">
            <Title order={3} mb={30}>
              Let's make a video!
            </Title>

            <Paper
              withBorder
              p={30}
              mb={30}
              style={{ textAlign: "center", cursor: "pointer" }}
              onClick={handleFileUpload}
            >
              <IconUpload size={48} stroke={1.5} color="#4C6EF5" style={{ marginBottom: 10 }} />
              <Text>Upload files</Text>
              <Text size="sm" color="dimmed">
                Choose files or drag them here
              </Text>
            </Paper>

            <Group grow>
              <Paper withBorder p={20} style={{ cursor: "pointer" }} onClick={() => onStart("record")}>
                <Stack align="center">
                  <IconVideo size={32} stroke={1.5} color="#4C6EF5" />
                  <Text>Start by recording</Text>
                </Stack>
              </Paper>

              <Paper withBorder p={20} style={{ cursor: "pointer" }} onClick={() => onStart("ai")}>
                <Stack align="center">
                  <IconRobot size={32} stroke={1.5} color="#4C6EF5" />
                  <Text>Start with AI</Text>
                </Stack>
              </Paper>
            </Group>
          </div>
        </div>
      )}
    </>
  )
}