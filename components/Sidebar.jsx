"use client"

import { Tooltip, Stack } from "@mantine/core"
import {
  IconBrandCodesandbox,
  IconVideo,
  IconMicrophone,
  IconSubtask,
  IconLetterT,
  IconLayoutGridAdd,
  IconSettings,
} from "@tabler/icons-react"

export default function Sidebar({ activeTab, onChangeTab }) {
  const tabs = [
    { id: "brand", icon: IconBrandCodesandbox, label: "Brand Kit" },
    { id: "video", icon: IconVideo, label: "Video" },
    { id: "audio", icon: IconMicrophone, label: "Audio" },
    { id: "subtitles", icon: IconSubtask, label: "Subtitles" },
    { id: "text", icon: IconLetterT, label: "Text" },
    { id: "elements", icon: IconLayoutGridAdd, label: "Elements" },
    { id: "settings", icon: IconSettings, label: "Settings" },
  ]

  return (
    <div className="sidebar">
      <div style={{ marginBottom: 20 }}>
        <img src="/v.png?height=40&width=40" alt="VEED.io" />
      </div>

      <Stack spacing={10}>
        {tabs.map((tab) => (
          <Tooltip key={tab.id} label={tab.label} position="right" withArrow>
            <div className={`sidebar-item ${activeTab === tab.id ? "active" : ""}`} onClick={() => onChangeTab(tab.id)}>
              <tab.icon size={24} className="sidebar-item-icon" />
              <span>{tab.label}</span>
            </div>
          </Tooltip>
        ))}
      </Stack>
    </div>
  )
}

