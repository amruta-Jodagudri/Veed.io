"use client"
import { Title, Group, NumberInput, ActionIcon } from "@mantine/core"
import { IconTrash } from "@tabler/icons-react"
import ElementsPanel from "./panels/ElementsPanel"
import VideoPanel from "./panels/VideoPanel"
import AudioPanel from "./panels/AudioPanel"
import SubtitlesPanel from "./panels/SubtitlesPanel"
import TextPanel from "./panels/TextPanel"
import BrandKitPanel from "./panels/BrandKitPanel"
import SettingsPanel from "./panels/SettingsPanel"

export default function ContentPanel({ activeTab, onAddMedia, selectedMedia, onUpdateMedia, onDeleteMedia }) {
  const renderPanel = () => {
    switch (activeTab) {
      case "elements":
        return <ElementsPanel onAddMedia={onAddMedia} />
      case "video":
        return <VideoPanel onAddMedia={onAddMedia} />
      case "audio":
        return <AudioPanel onAddMedia={onAddMedia} />
      case "subtitles":
        return <SubtitlesPanel onAddMedia={onAddMedia} />
      case "text":
        return <TextPanel onAddMedia={onAddMedia} />
      case "brand":
        return <BrandKitPanel onAddMedia={onAddMedia} />
      case "settings":
        return <SettingsPanel />
      default:
        return <VideoPanel onAddMedia={onAddMedia} />
    }
  }

  return (
    <div className="content-panel">
      {renderPanel()}

      {selectedMedia && (
        <div className="property-panel">
          <Group position="apart" mb={15}>
            <Title order={5}>Properties</Title>
            <ActionIcon color="red" variant="subtle" onClick={() => onDeleteMedia(selectedMedia.id)}>
              <IconTrash size={18} />
            </ActionIcon>
          </Group>

          <div className="property-group">
            <div className="property-group-title">Dimensions</div>

            <div className="property-row">
              <div className="property-label">Width</div>
              <div className="property-input">
                <NumberInput
                  value={selectedMedia.width}
                  onChange={(value) => onUpdateMedia(selectedMedia.id, { width: value })}
                  min={10}
                  max={1920}
                  step={10}
                />
              </div>
            </div>

            <div className="property-row">
              <div className="property-label">Height</div>
              <div className="property-input">
                <NumberInput
                  value={selectedMedia.height}
                  onChange={(value) => onUpdateMedia(selectedMedia.id, { height: value })}
                  min={10}
                  max={1080}
                  step={10}
                />
              </div>
            </div>
          </div>

          <div className="property-group">
            <div className="property-group-title">Timing</div>

            <div className="property-row">
              <div className="property-label">Start Time</div>
              <div className="property-input">
                <NumberInput
                  value={selectedMedia.startTime}
                  onChange={(value) => onUpdateMedia(selectedMedia.id, { startTime: value })}
                  min={0}
                  max={selectedMedia.endTime - 0.1}
                  step={0.1}
                  precision={1}
                />
              </div>
            </div>

            <div className="property-row">
              <div className="property-label">End Time</div>
              <div className="property-input">
                <NumberInput
                  value={selectedMedia.endTime}
                  onChange={(value) => onUpdateMedia(selectedMedia.id, { endTime: value })}
                  min={selectedMedia.startTime + 0.1}
                  max={60}
                  step={0.1}
                  precision={1}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}