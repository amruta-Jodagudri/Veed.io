import { Title, Switch, Slider, Select, ColorInput } from "@mantine/core"

export default function SettingsPanel() {
  return (
    <div>
      <Title order={4} mb={20}>
        Settings
      </Title>

      <div className="property-group">
        <div className="property-group-title">Canvas</div>

        <div className="property-row">
          <div className="property-label">Background</div>
          <div className="property-input">
            <ColorInput value="#000000" />
          </div>
        </div>

        <div className="property-row">
          <div className="property-label">Aspect Ratio</div>
          <div className="property-input">
            <Select
              data={[
                { value: "16:9", label: "Landscape (16:9)" },
                { value: "9:16", label: "Portrait (9:16)" },
                { value: "1:1", label: "Square (1:1)" },
                { value: "4:3", label: "Standard (4:3)" },
              ]}
              defaultValue="16:9"
            />
          </div>
        </div>
      </div>

      <div className="property-group">
        <div className="property-group-title">Playback</div>

        <div className="property-row">
          <div className="property-label">Volume</div>
          <div className="property-input">
            <Slider defaultValue={80} />
          </div>
        </div>

        <div className="property-row">
          <div className="property-label">Loop</div>
          <div className="property-input">
            <Switch />
          </div>
        </div>
      </div>

      <div className="property-group">
        <div className="property-group-title">Export</div>

        <div className="property-row">
          <div className="property-label">Quality</div>
          <div className="property-input">
            <Select
              data={[
                { value: "high", label: "High (1080p)" },
                { value: "medium", label: "Medium (720p)" },
                { value: "low", label: "Low (480p)" },
              ]}
              defaultValue="high"
            />
          </div>
        </div>

        <div className="property-row">
          <div className="property-label">Format</div>
          <div className="property-input">
            <Select
              data={[
                { value: "mp4", label: "MP4" },
                { value: "webm", label: "WebM" },
                { value: "gif", label: "GIF" },
              ]}
              defaultValue="mp4"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

