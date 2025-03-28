"use client"

import { useState, useRef, useEffect } from "react"
import { useDrag } from "@use-gesture/react"
import { IconVolume, IconMusic, IconWand, IconAffiliate, IconTransitionTop } from "@tabler/icons-react"

function MediaElement({ 
  media, 
  isSelected, 
  onSelect, 
  onUpdate,
  currentTime,
  isPlaying,
  registerVideoRef,
  canvasSize
}) {
  const videoRef = useRef(null)
  const [fullSizePosition, setFullSizePosition] = useState({ x: 0, y: 0 })
  const [fullSizeDimensions, setFullSizeDimensions] = useState({ width: canvasSize.width, height: canvasSize.height })
  
  const calculateNormalizedValues = () => {
    const scaleX = fullSizeDimensions.width / canvasSize.width
    const scaleY = fullSizeDimensions.height / canvasSize.height
    const offsetX = fullSizePosition.x / canvasSize.width
    const offsetY = fullSizePosition.y / canvasSize.height
    
    return {
      x: media.x + (offsetX * media.width),
      y: media.y + (offsetY * media.height),
      width: media.width * scaleX,
      height: media.height * scaleY
    }
  }

  const bindDrag = useDrag(({ movement: [dx, dy], first, last }) => {
    if (first) onSelect(media.id)
    if (!last) {
      if (isSelected) {
        setFullSizePosition(prev => ({
          x: prev.x + dx,
          y: prev.y + dy
        }))
      } else {
        onUpdate(media.id, {
          x: media.x + dx,
          y: media.y + dy,
        })
      }
    }
  })

  useEffect(() => {
    if (media.type === 'video' && registerVideoRef) {
      registerVideoRef(media.id, videoRef.current)
    }
  }, [media.id, media.type, registerVideoRef])

  useEffect(() => {
    if (media.type === 'video' && videoRef.current) {
      if (Math.abs(videoRef.current.currentTime - currentTime) > 0.1) {
        videoRef.current.currentTime = currentTime
      }
    }
  }, [currentTime, media.type])

  const handleResize = (corner, dx, dy, first, last) => {
    if (first) onSelect(media.id)
    if (!last) {
      if (isSelected) {
        let newWidth = fullSizeDimensions.width
        let newHeight = fullSizeDimensions.height
        let newX = fullSizePosition.x
        let newY = fullSizePosition.y

        switch (corner) {
          case "top-left":
            newX += dx
            newY += dy
            newWidth -= dx
            newHeight -= dy
            break
          case "top-right":
            newY += dy
            newWidth += dx
            newHeight -= dy
            break
          case "bottom-left":
            newX += dx
            newWidth -= dx
            newHeight += dy
            break
          case "bottom-right":
            newWidth += dx
            newHeight += dy
            break
        }

        if (newWidth < 50) newWidth = 50
        if (newHeight < 50) newHeight = 50

        setFullSizeDimensions({ width: newWidth, height: newHeight })
        setFullSizePosition({ x: newX, y: newY })
      } else {
        let updates = {}
        switch (corner) {
          case "top-left":
            updates = { x: media.x + dx, y: media.y + dy, width: media.width - dx, height: media.height - dy }
            break
          case "top-right":
            updates = { y: media.y + dy, width: media.width + dx, height: media.height - dy }
            break
          case "bottom-left":
            updates = { x: media.x + dx, width: media.width - dx, height: media.height + dy }
            break
          case "bottom-right":
            updates = { width: media.width + dx, height: media.height + dy }
            break
        }
        if (updates.width < 50) updates.width = 50
        if (updates.height < 50) updates.height = 50
        onUpdate(media.id, updates)
      }
    }
  }

  const bindResizeTopLeft = useDrag(({ movement: [dx, dy], first, last }) => {
    handleResize("top-left", dx, dy, first, last)
  })

  const bindResizeTopRight = useDrag(({ movement: [dx, dy], first, last }) => {
    handleResize("top-right", dx, dy, first, last)
  })

  const bindResizeBottomLeft = useDrag(({ movement: [dx, dy], first, last }) => {
    handleResize("bottom-left", dx, dy, first, last)
  })

  const bindResizeBottomRight = useDrag(({ movement: [dx, dy], first, last }) => {
    handleResize("bottom-right", dx, dy, first, last)
  });

  useEffect(() => {
    if (!isSelected) {
      const normalized = calculateNormalizedValues()
      onUpdate(media.id, {
        x: normalized.x,
        y: normalized.y,
        width: normalized.width,
        height: normalized.height
      })
      setFullSizePosition({ x: 0, y: 0 })
      setFullSizeDimensions({ width: canvasSize.width, height: canvasSize.height })
    }
  }, [isSelected])

  return (
    <div
      className={`media-element ${isSelected ? "selected" : ""}`}
      style={{
        position: 'absolute',
        left: isSelected ? fullSizePosition.x : media.x,
        top: isSelected ? fullSizePosition.y : media.y,
        width: isSelected ? fullSizeDimensions.width : media.width,
        height: isSelected ? fullSizeDimensions.height : media.height,
        border: isSelected ? '2px dashed #4c6ef5' : 'none',
        zIndex: isSelected ? 2 : 1,
        transform: isSelected ? 'scale(1)' : 'none',
        transformOrigin: 'top left'
      }}
      onClick={() => onSelect(media.id)}
      {...bindDrag()}
    >
      {media.type === "video" && (
        <video 
          ref={videoRef}
          src={media.src} 
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover" 
          }}
          controls={isSelected}
          muted
        />
      )}

      {media.type === "image" && (
        <img
          src={media.src || "/placeholder.svg"}
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: isSelected ? "contain" : "cover" 
          }}
          alt={media.name || "Media"}
        />
      )}

      {media.type === "audio" && (
        <div className="audio-element">
          <IconVolume size={24} style={{ marginRight: 10 }} />
          <div className="audio-element-waveform"></div>
        </div>
      )}

      {isSelected && (
        <>
          <div className="resize-handle" style={{ top: -5, left: -5 }} {...bindResizeTopLeft()} />
          <div className="resize-handle" style={{ top: -5, right: -5 }} {...bindResizeTopRight()} />
          <div className="resize-handle" style={{ bottom: -5, left: -5 }} {...bindResizeBottomLeft()} />
          <div className="resize-handle" style={{ bottom: -5, right: -5 }} {...bindResizeBottomRight()} />
          
          <div style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: 4,
            cursor: 'pointer',
            zIndex: 3
          }} onClick={(e) => {
            e.stopPropagation()
            onSelect(null)
          }}>
          </div>
        </>
      )}
    </div>
  )
}

function MediaToolButton({ icon: Icon, label, isActive = false, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '12px',
        color: isActive ? '#4c6ef5' : '#495057',
        transition: 'all 0.2s ease',
        minWidth: '80px',
      }}
    >
      <div style={{
        backgroundColor: isActive ? '#e9ecef' : '#f8f9fa',
        padding: '8px',
        borderRadius: '8px',
        marginBottom: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
      }}>
        <Icon size={20} stroke={1.5} />
      </div>
      {label}
    </button>
  )
}

export default function Canvas({
  mediaElements,
  selectedMedia,
  onSelectMedia,
  onUpdateMedia,
  currentTime,
  isPlaying,
  registerVideoRef
}) {
  const [canvasSize, setCanvasSize] = useState({ width: 640, height: 360 })
  const [activeTool, setActiveTool] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const updateSize = () => {
      const container = containerRef.current
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight

      let width, height
      if ((containerWidth / 16) * 9 <= containerHeight) {
        width = containerWidth * 0.8
        height = (width / 16) * 9
      } else {
        height = containerHeight * 0.8
        width = (height * 16) / 9
      }

      setCanvasSize({ width, height })
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const visibleElements = mediaElements.filter(
    media => currentTime >= media.startTime && currentTime <= media.endTime
  )

  return (
    <div 
      className="canvas-area" 
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        width: '100%',
      }}
    >
      <div
        className="canvas"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
          backgroundColor: '#000',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '8px',
        }}
      >
        {visibleElements.map(media => (
          <MediaElement
            key={media.id}
            media={media}
            isSelected={media.id === selectedMedia}
            onSelect={onSelectMedia}
            onUpdate={onUpdateMedia}
            currentTime={currentTime}
            isPlaying={isPlaying}
            registerVideoRef={registerVideoRef}
            canvasSize={canvasSize}
          />
        ))}

        {selectedMedia && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '16px',
            padding: '8px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 10,
          }}>
            <MediaToolButton
              icon={IconWand}
              label="Magic Tools"
              isActive={activeTool === 'magic'}
              onClick={() => setActiveTool(activeTool === 'magic' ? null : 'magic')}
            />
            
            <MediaToolButton
              icon={IconAffiliate}
              label="Animation"
              isActive={activeTool === 'animations'}
              onClick={() => setActiveTool(activeTool === 'animations' ? null : 'animations')}
            />
            
            <MediaToolButton
              icon={IconTransitionTop}
              label="Transitions"
              isActive={activeTool === 'transitions'}
              onClick={() => setActiveTool(activeTool === 'transitions' ? null : 'transitions')}
            />
          </div>
        )}
      </div>
    </div>
  )
}