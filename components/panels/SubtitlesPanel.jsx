import { Text, Title, Button } from "@mantine/core"
import { IconUpload, IconSubtask, IconKeyboard } from "@tabler/icons-react"

export default function SubtitlesPanel({ onAddMedia }) {
  return (
    <div>
      <Title order={4} mb={15}>
        Add Subtitles
      </Title>

      <div
        className="element-section"
        style={{ backgroundColor: "#edf2ff", padding: 20, borderRadius: 8, marginBottom: 20 }}
      >
        <Text size="sm" mb={10}>
          Auto Subtitles can't be added yet
        </Text>
        <Text size="sm" color="dimmed">
          Please upload some content to get started with your timeline!
        </Text>
      </div>

      <Button fullWidth color="indigo" leftSection={<IconUpload size={16} />} mb={15}>
        Upload Media
      </Button>

      <Button fullWidth variant="outline" leftSection={<IconKeyboard size={16} />} mb={15}>
        Transcribe Manually
      </Button>

      <Button fullWidth variant="outline" leftSection={<IconSubtask size={16} />}>
        Upload Subtitles File
      </Button>
    </div>
  )
}

