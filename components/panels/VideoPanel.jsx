"use client"

import { useState, useRef } from "react"
import { Text, Title, Button, Group, Stack, TextInput, Modal } from "@mantine/core"
import { IconUpload, IconBrandCodesandbox, IconLetterT, IconMicrophone, IconLink } from "@tabler/icons-react"

export default function VideoPanel({ onAddMedia }) {
  const [importLinkOpen, setImportLinkOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const fileInputRef = useRef(null)

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const fileType = file.type.split("/")[0]

      const fileUrl = URL.createObjectURL(file)

      onAddMedia({
        type: fileType,
        src: fileUrl,
        name: file.name,
      })
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const fileType = file.type.split("/")[0]

      const fileUrl = URL.createObjectURL(file)

      onAddMedia({
        type: fileType,
        src: fileUrl,
        name: file.name,
      })
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleImportFromLink = () => {
    if (linkUrl) {
      let type = "video"
      if (linkUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        type = "image"
      } else if (linkUrl.match(/\.(mp3|wav|ogg)$/i)) {
        type = "audio"
      }

      onAddMedia({
        type,
        src: linkUrl,
        name: "Imported from URL",
      })

      setLinkUrl("")
      setImportLinkOpen(false)
    }
  }

  const handleRecordClick = () => {
    onAddMedia({ type: "record" })
  }

  return (
    <div>
      <Title order={4} mb={15}>
        Add Media
      </Title>

      <div
        className="upload-area"
        onClick={() => fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileUpload}
          accept="video/*,image/*,audio/*"
        />
        <Stack align="center" spacing={10}>
          <IconUpload size={32} stroke={1.5} color="#4C6EF5" />
          <Text weight={500}>Upload a File</Text>
          <Text size="sm" color="dimmed">
            Drag & drop a file
          </Text>
          <Text
            size="sm"
            color="blue"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation()
              setImportLinkOpen(true)
            }}
          >
            import from a link
          </Text>
        </Stack>
      </div>

      <Group grow mb={20}>
        <Button leftSection={<IconMicrophone size={16} />} variant="outline" onClick={handleRecordClick}>
          Record
        </Button>
        <Button leftSection={<IconBrandCodesandbox size={16} />} variant="outline">
          Brand Kits
        </Button>
      </Group>

      <Group grow mb={20}>
        <Button leftSection={<IconLetterT size={16} />} variant="outline">
          Text To Speech
        </Button>
        <Button leftSection={<IconMicrophone size={16} />} variant="outline">
          Voice Clone
        </Button>
      </Group>

      <Title order={5} mt={30} mb={15}>
        AI Avatars
      </Title>

      <div className="element-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="element-item">
            <img
              src={`/avatars/avatar-${i}.png`}
              alt={`AI Avatar ${i}`}
              style={{ 
                width: "100%", 
                height: "auto",
                borderRadius: "20%",
                objectFit: "cover"
              }}
            />
          </div>
        ))}
      </div>

      <Text size="sm" color="blue" mt={10} style={{ textAlign: "right" }}>
        View All
      </Text>

      <Modal opened={importLinkOpen} onClose={() => setImportLinkOpen(false)} title="Import from URL" size="md">
        <Stack>
          <TextInput
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            icon={<IconLink size={16} />}
          />
          <Button onClick={handleImportFromLink} disabled={!linkUrl}>
            Import
          </Button>
        </Stack>
      </Modal>
    </div>
  )
}

