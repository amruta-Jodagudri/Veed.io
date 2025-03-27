"use client"

import { ActionIcon, Group, Text, Slider } from "@mantine/core"
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
} from "@tabler/icons-react"
import { useRef } from 'react'

export default function Timeline({
  mediaElements,
  selectedMedia,
  onSelectMedia,
  onUpdateMedia,
  isPlaying,
  currentTime,
  duration,
  onTogglePlayback,
  onTimeChange = () => {}
}) {
  const timelineRef = useRef(null)
  const isDragging = useRef(false)

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const renderTimelineRuler = () => {
    const marks = []
    const step = duration > 60 ? 10 : 5
    for (let i = 0; i <= duration; i += step) {
      marks.push(
        <div key={i} className="timeline-ruler-mark" style={{ left: `${(i / duration) * 100}%` }}>
          <div style={{ marginTop: 12, marginLeft: 3 }}>{formatTime(i)}</div>
        </div>
      )
    }
    return marks
  }

  const getMediaColor = (type) => {
    switch(type) {
      case 'video': return '#4c6ef5'
      case 'image': return '#748ffc'
      case 'audio': return '#5c7cfa'
      case 'text': return '#91a7ff'
      default: return '#bac8ff'
    }
  }

  const handleScrubberClick = (e) => {
    if (!timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    const newTime = Math.max(0, Math.min(duration, pos * duration))
    onTimeChange(newTime)
  }

  const handleScrubberDragStart = (e) => {
    isDragging.current = true
    document.addEventListener('mousemove', handleScrubberDrag)
    document.addEventListener('mouseup', handleScrubberDragEnd)
    handleScrubberDrag(e)
  }

  const handleScrubberDrag = (e) => {
    if (!isDragging.current || !timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    const newTime = Math.max(0, Math.min(duration, pos * duration))
    onTimeChange(newTime)
  }

  const handleScrubberDragEnd = () => {
    isDragging.current = false
    document.removeEventListener('mousemove', handleScrubberDrag)
    document.removeEventListener('mouseup', handleScrubberDragEnd)
  }

  const handleTrackResize = (id, e, direction) => {
    e.stopPropagation()
    const startX = e.clientX
    const media = mediaElements.find(m => m.id === id)
    const startTime = media.startTime
    const endTime = media.endTime
    const clipDuration = endTime - startTime

    const handleMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX
      const timelineWidth = timelineRef.current?.getBoundingClientRect().width || 1
      const deltaTime = (deltaX / timelineWidth) * duration

      if (direction === 'left') {
        const newStartTime = Math.max(0, Math.min(startTime + deltaTime, endTime - 0.5))
        onUpdateMedia(id, { startTime: newStartTime })
      } else {
        const newEndTime = Math.min(duration, Math.max(endTime + deltaTime, startTime + 0.5))
        onUpdateMedia(id, { endTime: newEndTime })
      }
    }

    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
  }

  return (
    <div className="timeline">
      <div className="timeline-ruler" ref={timelineRef} onClick={handleScrubberClick}>
        {renderTimelineRuler()}
        <div
          className="timeline-scrubber"
          style={{ left: `${(currentTime / duration) * 100}%` }}
          onMouseDown={handleScrubberDragStart}
        />
      </div>

      <div className="timeline-tracks">
        {mediaElements.map(media => (
          <div
            key={media.id}
            className="timeline-item"
            style={{
              left: `${(media.startTime / duration) * 100}%`,
              width: `${((media.endTime - media.startTime) / duration) * 100}%`,
              backgroundColor: media.id === selectedMedia 
                ? getMediaColor(media.type) 
                : `${getMediaColor(media.type)}80`,
              border: media.id === selectedMedia ? '2px solid white' : 'none'
            }}
            onClick={() => onSelectMedia(media.id)}
          >
            <div 
              className="timeline-resize-handle left"
              onMouseDown={e => handleTrackResize(media.id, e, 'left')}
            />
            <Text size="xs" color="white" p={5} truncate>
              {media.name || media.type}
            </Text>
            <div 
              className="timeline-resize-handle right"
              onMouseDown={e => handleTrackResize(media.id, e, 'right')}
            />
          </div>
        ))}
      </div>

      <div className="timeline-controls">
        <Group>
          <ActionIcon variant="subtle" onClick={() => onTimeChange(Math.max(0, currentTime - 1))}>
            <IconPlayerSkipBack size={18} />
          </ActionIcon>
          <ActionIcon 
            variant="filled" 
            color="indigo" 
            radius="xl" 
            size="lg" 
            onClick={onTogglePlayback}
          >
            {isPlaying ? <IconPlayerPause size={18} /> : <IconPlayerPlay size={18} />}
          </ActionIcon>
          <ActionIcon variant="subtle" onClick={() => onTimeChange(Math.min(duration, currentTime + 1))}>
            <IconPlayerSkipForward size={18} />
          </ActionIcon>
          <Text>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
        </Group>
        
        <Slider
          value={currentTime}
          onChange={onTimeChange}
          min={0}
          max={duration}
          step={0.1}
          style={{ flex: 1, margin: '0 20px' }}
          label={formatTime}
        />
      </div>
    </div>
  )
}