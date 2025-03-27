import { Text, Title, Button, Group, Stack, TextInput } from "@mantine/core"
import {
  IconUpload,
  IconSearch,
  IconMicrophone,
  IconBrandCodesandbox,
  IconLetterT,
  IconVolume,
  IconPlayerPlay,
} from "@tabler/icons-react"

export default function AudioPanel({ onAddMedia }) {
  return (
    <div>
      <Title order={4} mb={15}>
        Add Audio
      </Title>

      <div className="upload-area">
        <Stack align="center" spacing={10}>
          <IconUpload size={32} stroke={1.5} color="#4C6EF5" />
          <Text weight={500}>Upload a File</Text>
          <Text size="sm" color="dimmed">
            Drag & drop a file
          </Text>
        </Stack>
      </div>

      <Group grow mb={20}>
        <Button leftSection={<IconBrandCodesandbox size={16} />} variant="outline">
          Brand Kits
        </Button>
        <Button leftSection={<IconLetterT size={16} />} variant="outline">
          Text To Speech
        </Button>
      </Group>

      <Group grow mb={20}>
        <Button leftSection={<IconMicrophone size={16} />} variant="outline">
          Voice Clone
        </Button>
        <Button leftSection={<IconVolume size={16} />} variant="outline">
          Voiceover
        </Button>
      </Group>

      <Title order={5} mt={30} mb={15}>
        Stock Music
      </Title>

      <TextInput placeholder="Search" icon={<IconSearch size={16} />} mb={15} />

      <Group mb={20}>
        <Button variant="outline" size="xs">
          R&B
        </Button>
        <Button variant="outline" size="xs">
          Jazz
        </Button>
        <Button variant="outline" size="xs">
          Blues
        </Button>
        <Button variant="outline" size="xs">
          Pop
        </Button>
      </Group>

      <div className="element-section">
        <div className="element-item" style={{ padding: 10, marginBottom: 10 }}>
          <Group>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "#f1f3f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconPlayerPlay size={20} />
            </div>
            <div>
              <Text size="sm">Lofi Background Vlog Hip Hop</Text>
              <Text size="xs" color="dimmed">
                2:01
              </Text>
            </div>
          </Group>
        </div>

        <div className="element-item" style={{ padding: 10 }}>
          <Group>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "#f1f3f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconPlayerPlay size={20} />
            </div>
            <div>
              <Text size="sm">Deep House In Cafe</Text>
              <Text size="xs" color="dimmed">
                4:48
              </Text>
            </div>
          </Group>
        </div>
      </div>
    </div>
  )
}

