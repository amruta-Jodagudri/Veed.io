import { Text, Title, Button } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"

export default function BrandKitPanel({ onAddMedia }) {
  return (
    <div>
      <Title order={4} mb={15}>
        Brand Kits
      </Title>

      <div style={{ marginBottom: 20 }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          controls
          src="/multi-brand-kits.mp4"
          style={{ width: "100%", height: "auto", borderRadius: 8, border: "1px solid #e9ecef" }}
        />
      </div>

      <Title order={5} mb={15}>
        Stay on brand with Brand Kits
      </Title>
      <Text size="sm" color="dimmed" mb={20} style={{ textAlign: "center" }}>
        Create Brand Kits to manage and organise your own audios, videos and images.
      </Text>

      <Button fullWidth color="indigo" leftSection={<IconPlus size={16} />}>
        Create brand kit
      </Button>
    </div>
  )
}

