"use client"

import { useState, useRef, useEffect } from "react"
import { Button, Group, Stack, Title, Text, Paper, SimpleGrid, ActionIcon } from "@mantine/core"
import {
  IconArrowLeft,
  IconCamera,
  IconMicrophone,
  IconScreenShare,
  IconPlayerRecord,
  IconPlayerStop,
} from "@tabler/icons-react"

export default function RecordingInterface({ onComplete }) {
  const [recordingType, setRecordingType] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [stream, setStream] = useState(null)
  const [recordedChunks, setRecordedChunks] = useState([])
  const [recordedUrl, setRecordedUrl] = useState(null)
  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)

  const handleGoBack = () => {
    stopMediaTracks()
    onComplete(null)
  }

  const stopMediaTracks = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
  }

  const startRecording = async (type) => {
    setRecordingType(type)
    try {
      let mediaStream

      if (type === "camera" || type === "screen-camera") {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
      } else if (type === "audio") {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
      } else if (type === "screen" || type === "slides-camera" || type === "slides") {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        })

        if (type === "slides-camera") {
          const cameraStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          })

          mediaStream = new MediaStream([
            ...mediaStream.getVideoTracks(),
            ...cameraStream.getVideoTracks(),
            ...mediaStream.getAudioTracks(),
          ])
        }
      }

      setStream(mediaStream)

      if (videoRef.current && type !== "audio") {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error("Error accessing media devices:", err)
    }
  }

  const handleRecordingStart = () => {
    if (!stream) return

    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data])
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, {
        type: recordingType === "audio" ? "audio/webm" : "video/webm",
      })
      const url = URL.createObjectURL(blob)
      setRecordedUrl(url)
    }

    mediaRecorder.start()
    setIsRecording(true)
  }

  const handleRecordingStop = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      stopMediaTracks()
    }
  }

  const handleUseRecording = () => {
    if (recordedUrl) {
      onComplete({
        type: recordingType === "audio" ? "audio" : "video",
        src: recordedUrl,
        name: `Recorded ${recordingType}`,
      })
    }
  }

  const handleRetry = () => {
    setRecordedChunks([])
    setRecordedUrl(null)
    startRecording(recordingType)
  }

  useEffect(() => {
    return () => {
      stopMediaTracks()
      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl)
      }
    }
  }, [recordedUrl])

  if (!recordingType) {
    return (
      <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
        <Group mb={30}>
          <ActionIcon onClick={handleGoBack} variant="subtle">
            <IconArrowLeft size={24} />
          </ActionIcon>
          <Title order={3}>What would you like to record?</Title>
        </Group>

        <SimpleGrid cols={3} spacing="lg">
          <Paper
            withBorder
            p={20}
            style={{ cursor: "pointer", textAlign: "center" }}
            onClick={() => startRecording("camera")}
          >
            <Stack align="center" spacing={10}>
              <div
                style={{
                  width: "100px",
                  height: "80px",
                  background: "#f1f3f5",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                <IconCamera size={40} color="#4C6EF5" />
              </div>
              <Text>Camera</Text>
            </Stack>
          </Paper>

          <Paper
            withBorder
            p={20}
            style={{ cursor: "pointer", textAlign: "center" }}
            onClick={() => startRecording("audio")}
          >
            <Stack align="center" spacing={10}>
              <div
                style={{
                  width: "100px",
                  height: "80px",
                  background: "#f1f3f5",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                <IconMicrophone size={40} color="#4C6EF5" />
              </div>
              <Text>Audio</Text>
            </Stack>
          </Paper>

          <Paper
            withBorder
            p={20}
            style={{ cursor: "pointer", textAlign: "center" }}
            onClick={() => startRecording("screen")}
          >
            <Stack align="center" spacing={10}>
              <div
                style={{
                  width: "100px",
                  height: "80px",
                  background: "#f1f3f5",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                <IconScreenShare size={40} color="#4C6EF5" />
              </div>
              <Text>Screen</Text>
            </Stack>
          </Paper>

          <Paper
            withBorder
            p={20}
            style={{ cursor: "pointer", textAlign: "center" }}
            onClick={() => startRecording("screen-camera")}
          >
            <Stack align="center" spacing={10}>
              <div
                style={{
                  width: "100px",
                  height: "80px",
                  background: "#f1f3f5",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                <Group>
                  <IconScreenShare size={30} color="#4C6EF5" />
                  <IconCamera size={30} color="#4C6EF5" />
                </Group>
              </div>
              <Text>Screen & Camera</Text>
            </Stack>
          </Paper>

          <Paper
            withBorder
            p={20}
            style={{ cursor: "pointer", textAlign: "center" }}
            onClick={() => startRecording("slides-camera")}
          >
            <Stack align="center" spacing={10}>
              <div
                style={{
                  width: "100px",
                  height: "80px",
                  background: "#f1f3f5",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                <Group>
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      background: "#e7f5ff",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconScreenShare size={20} color="#4C6EF5" />
                  </div>
                  <IconCamera size={30} color="#4C6EF5" />
                </Group>
              </div>
              <Text>Slides & Camera</Text>
            </Stack>
          </Paper>

          <Paper
            withBorder
            p={20}
            style={{ cursor: "pointer", textAlign: "center" }}
            onClick={() => startRecording("slides")}
          >
            <Stack align="center" spacing={10}>
              <div
                style={{
                  width: "100px",
                  height: "80px",
                  background: "#f1f3f5",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    background: "#e7f5ff",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconScreenShare size={30} color="#4C6EF5" />
                </div>
              </div>
              <Text>Slides</Text>
            </Stack>
          </Paper>
        </SimpleGrid>

        <Group position="center" mt={40} spacing="xl">
          <Paper withBorder p={10} style={{ textAlign: "center", width: "80px" }}>
            <Stack align="center" spacing={5}>
              <IconCamera size={24} />
              <Text size="xs">Show Cam</Text>
            </Stack>
          </Paper>

          <Paper withBorder p={10} style={{ textAlign: "center", width: "80px" }}>
            <Stack align="center" spacing={5}>
              <IconMicrophone size={24} />
              <Text size="xs">Unmute</Text>
            </Stack>
          </Paper>

          <Paper withBorder p={10} style={{ textAlign: "center", width: "80px" }}>
            <Stack align="center" spacing={5}>
              <IconScreenShare size={24} />
              <Text size="xs">Screen</Text>
            </Stack>
          </Paper>

          <Paper withBorder p={10} style={{ textAlign: "center", width: "80px" }}>
            <Stack align="center" spacing={5}>
              <IconScreenShare size={24} />
              <Text size="xs">Slides</Text>
            </Stack>
          </Paper>

          <Paper withBorder p={10} style={{ textAlign: "center", width: "80px" }}>
            <Stack align="center" spacing={5}>
              <IconScreenShare size={24} />
              <Text size="xs">Settings</Text>
            </Stack>
          </Paper>
        </Group>
      </div>
    )
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Group mb={20}>
        <ActionIcon onClick={handleGoBack} variant="subtle">
          <IconArrowLeft size={24} />
        </ActionIcon>
        <Title order={3}>Recording {recordingType}</Title>
      </Group>

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
        {recordingType !== "audio" ? (
          recordedUrl ? (
            <video src={recordedUrl} controls style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          ) : (
            <video ref={videoRef} autoPlay muted style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          )
        ) : recordedUrl ? (
          <audio src={recordedUrl} controls style={{ width: "80%" }} />
        ) : (
          <IconMicrophone size={64} color={isRecording ? "#fa5252" : "#ced4da"} />
        )}
      </div>

      <Group position="center">
        {!recordedUrl ? (
          isRecording ? (
            <Button
              color="red"
              size="lg"
              radius="xl"
              leftSection={<IconPlayerStop size={20} />}
              onClick={handleRecordingStop}
            >
              Stop Recording
            </Button>
          ) : (
            <Button
              color="red"
              size="lg"
              radius="xl"
              leftSection={<IconPlayerRecord size={20} />}
              onClick={handleRecordingStart}
            >
              Start Recording
            </Button>
          )
        ) : (
          <Group>
            <Button variant="outline" onClick={handleRetry}>
              Record Again
            </Button>
            <Button color="indigo" onClick={handleUseRecording}>
              Use This Recording
            </Button>
          </Group>
        )}
      </Group>
    </div>
  )
}

