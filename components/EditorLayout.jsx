"use client"

import { useState, useEffect, useRef } from "react"
import { Text, Group, Button, TextInput, ActionIcon } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import Sidebar from "./Sidebar"
import ContentPanel from "./ContentPanel"
import Canvas from "./Canvas"
import Timeline from "./Timeline"

export default function EditorLayout({ mode, initialMedia }) {
  const [activeTab, setActiveTab] = useState("video")
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [mediaElements, setMediaElements] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(60)
  const [projectName, setProjectName] = useState("Project Name")
  const [isEditingProjectName, setIsEditingProjectName] = useState(false)
  const videoRefs = useRef({})
  const animationRef = useRef(null)

  const registerVideoRef = (id, ref) => {
    videoRefs.current[id] = ref
  }

  useEffect(() => {
    if (initialMedia) {
      const newMedia = {
        id: Date.now().toString(),
        type: initialMedia.type,
        src: initialMedia.src,
        name: initialMedia.name || "Uploaded Media",
        x: 100,
        y: 100,
        width: initialMedia.type === "audio" ? 320 : 320,
        height: initialMedia.type === "audio" ? 80 : 240,
        startTime: 0,
        endTime: initialMedia.duration || 10,
      }

      setMediaElements(prev => [...prev, newMedia])
      setSelectedMedia(newMedia.id)
      setDuration(prev => Math.max(prev, initialMedia.duration || 60))
    }
  }, [initialMedia])

  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now() - currentTime * 1000
      
      const updateTime = () => {
        const elapsed = (Date.now() - startTime) / 1000
        if (elapsed >= duration) {
          setCurrentTime(0)
          setIsPlaying(false)
        } else {
          setCurrentTime(elapsed)
          animationRef.current = requestAnimationFrame(updateTime)
        }
      }
      
      animationRef.current = requestAnimationFrame(updateTime)
      return () => cancelAnimationFrame(animationRef.current)
    }
  }, [isPlaying, currentTime, duration])

  useEffect(() => {
    Object.values(videoRefs.current).forEach(video => {
      if (!video) return
      
      try {
        if (isPlaying) {
          const playPromise = video.play()
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Video play error:", error)
            })
          }
        } else {
          video.pause()
        }
      } catch (error) {
        console.error("Video control error:", error)
      }
    })
  }, [isPlaying])

  useEffect(() => {
    Object.values(videoRefs.current).forEach(video => {
      if (video && Math.abs(video.currentTime - currentTime) > 0.1) {
        video.currentTime = currentTime
      }
    })
  }, [currentTime])

  const handleAddMedia = (media) => {
    if (media.type === "record") return

    const newMedia = {
      id: Date.now().toString(),
      type: media.type,
      src: media.src,
      name: media.name || "Media Element",
      x: 100,
      y: 100,
      width: media.type === "audio" ? 320 : 320,
      height: media.type === "audio" ? 80 : 240,
      startTime: 0,
      endTime: media.duration || 10,
    }

    setMediaElements(prev => [...prev, newMedia])
    setSelectedMedia(newMedia.id)
    
    if (media.type === "video" && media.duration) {
      setDuration(prev => Math.max(prev, media.duration))
    }
  }

  const handleSelectMedia = (id) => {
    setSelectedMedia(id)
  }

  const handleUpdateMedia = (id, updates) => {
    setMediaElements(prev => 
      prev.map(media => media.id === id ? { ...media, ...updates } : media)
    )
  }

  const handleDeleteMedia = (id) => {
    setMediaElements(prev => prev.filter(media => media.id !== id))
    if (selectedMedia === id) setSelectedMedia(null)
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const handleTimeChange = (newTime) => {
    setCurrentTime(newTime)
    if (isPlaying) setIsPlaying(false)
  }

  const handleDownload = () => {
    // Find the main video element to download
    const mainVideo = mediaElements.find(media => media.type === "video");
    
    if (mainVideo) {
      const videoSrc = mainVideo.src;
      const link = document.createElement('a');
      link.href = videoSrc;
      link.download = `${projectName}.${videoSrc.split('.').pop().split('?')[0]}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No video found to download");
    }
  }

  return (
    <div className="editor-container">
      <Sidebar activeTab={activeTab} onChangeTab={setActiveTab} />

      <ContentPanel
        activeTab={activeTab}
        onAddMedia={handleAddMedia}
        selectedMedia={mediaElements.find(media => media.id === selectedMedia)}
        onUpdateMedia={handleUpdateMedia}
        onDeleteMedia={handleDeleteMedia}
      />

      <div className="canvas-container">
        <div className="canvas-header">
          <Group>
            {isEditingProjectName ? (
              <TextInput
                placeholder="Project Name"
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={() => setIsEditingProjectName(false)}
                autoFocus
              />
            ) : (
              <Text onClick={() => setIsEditingProjectName(true)} style={{ cursor: 'pointer' }}>
                {projectName}
              </Text>
            )}
            {/* <ActionIcon variant="subtle">
              <IconArrowLeft size={18} />
            </ActionIcon>
            <ActionIcon variant="subtle">
              <IconArrowRight size={18} />
            </ActionIcon> */}
          </Group>

          <Group>
            <TextInput placeholder="Search" icon={<IconSearch size={16} />} size="xs" />
            <Text size="sm">Save your project for later —</Text>
            <Button variant="subtle" color="blue" size="xs">
              sign up
            </Button>
            <Text size="sm">or</Text>
            <Button variant="subtle" color="blue" size="xs">
              log in
            </Button>
            <Button color="orange">Upgrade</Button>
            <Button color="indigo" onClick={handleDownload}>Download</Button>
          </Group>
        </div>

        <Canvas
          mediaElements={mediaElements}
          selectedMedia={selectedMedia}
          onSelectMedia={handleSelectMedia}
          onUpdateMedia={handleUpdateMedia}
          currentTime={currentTime}
          isPlaying={isPlaying}
          registerVideoRef={registerVideoRef}
        />

        <Timeline
          mediaElements={mediaElements}
          selectedMedia={selectedMedia}
          onSelectMedia={setSelectedMedia}
          onUpdateMedia={handleUpdateMedia}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onTogglePlayback={togglePlayback}
          onTimeChange={handleTimeChange}
        />
      </div>
    </div>
  )
}