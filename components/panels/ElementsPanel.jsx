'use client'

import { useState, useRef, useEffect } from 'react';
import { Text, Title, Group, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Line } from 'rc-progress';
import WaveSurfer from 'wavesurfer.js';
import 'wavesurfer.js/dist/wavesurfer.cjs';
import { ReactSVG } from 'react-svg';

const ElementsPanel = ({ onAddMedia }) => {
  const progressBars = [
    { id: "blue-bar", component: <Line percent={70} strokeColor="#4dabf7" /> },
    { id: "pink-bar", component: <Line percent={40} strokeColor="#f783ac" /> },
    { id: "circle-bar", component: <Line percent={30} strokeWidth={10} trailWidth={10} strokeColor="#4dabf7" strokeLinecap="round" /> }
  ];

  const Waveform = ({ color }) => {
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);

    useEffect(() => {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: color,
        progressColor: '#3b82f6',
        height: 60,
        barWidth: 2,
        responsive: true,
      });

      return () => {
        wavesurferRef.current.destroy();
      };
    }, [color]);

    return <div ref={waveformRef} />;
  };

  const soundWaves = [
    { id: "wave1", color: "#63e6be" },
    { id: "wave2", color: "#ffa94d" },
    { id: "wave3", color: "#da77f2" }
  ];

  const shapes = [
    { 
      id: "rect", 
      component: <ReactSVG 
        src="https://unpkg.com/simple-svg@1.0.0/rectangle.svg"
        beforeInjection={(svg) => {
          svg.setAttribute('style', 'width: 50px; height: 50px; fill: #FDBD69');
        }}
      /> 
    },
    { 
      id: "circle", 
      component: <ReactSVG 
        src="https://unpkg.com/simple-svg@1.0.0/circle.svg"
        beforeInjection={(svg) => {
          svg.setAttribute('style', 'width: 50px; height: 50px; fill: #6EDCD9');
        }}
      /> 
    },
    { 
      id: "triangle", 
      component: <ReactSVG 
        src="https://unpkg.com/simple-svg@1.0.0/triangle.svg"
        beforeInjection={(svg) => {
          svg.setAttribute('style', 'width: 50px; height: 50px; fill: #7FCD91');
        }}
      /> 
    }
  ];

  const emojis = [
    { id: "emoji1", emoji: "😂" },
    { id: "emoji2", emoji: "😢" },
    { id: "emoji3", emoji: "😮" },
    { id: "emoji4", emoji: "😊" }
  ];

  return (
    <div style={{ padding: "16px", height: "100%", overflowY: "auto" }}>
      <Title order={4} mb={15}>
        Elements
      </Title>

      <div className="element-section1">
        <Group position="apart" mb={10}>
          <Text weight={500}>Progress Bars</Text>
          <Text size="sm" color="blue" style={{ cursor: "pointer" }}>
            View All
          </Text>
        </Group>

        <div className="element-grid1">
          {progressBars.map((bar) => (
            <div 
              key={bar.id} 
              className="element-item1" 
              onClick={() => onAddMedia(bar)}
              style={{ padding: "8px", backgroundColor: "#f8f9fa", borderRadius: "4px" }}
            >
              {bar.component}
            </div>
          ))}
        </div>
      </div>

      <div className="element-section1" style={{ marginTop: 30 }}>
        <Group position="apart" mb={10}>
          <Text weight={500}>Emojis</Text>
          <Text size="sm" color="blue" style={{ cursor: "pointer" }}>
            View All
          </Text>
        </Group>

        <div className="element-grid1">
          {emojis.map((emoji) => (
            <div 
              key={emoji.id} 
              className="element-item1" 
              onClick={() => onAddMedia({ type: "emoji", content: emoji.emoji })}
              style={{ 
                padding: "8px", 
                backgroundColor: "#f8f9fa", 
                borderRadius: "4px",
                fontSize: "24px",
                display: "flex",
                justifyContent: "center"
              }}
            >
              {emoji.emoji}
            </div>
          ))}
        </div>
      </div>

      <div className="element-section1" style={{ marginTop: 30 }}>
        <Group position="apart" mb={10}>
          <Text weight={500}>Sound Waves</Text>
          <Text size="sm" color="blue" style={{ cursor: "pointer" }}>
            View All
          </Text>
        </Group>

        <div className="element-grid1">
          {soundWaves.map((wave) => (
            <div 
              key={wave.id} 
              className="element-item1" 
              onClick={() => onAddMedia({ type: "waveform", color: wave.color })}
              style={{ padding: "8px", backgroundColor: "#f8f9fa", borderRadius: "4px" }}
            >
              <Waveform color={wave.color} />
            </div>
          ))}
        </div>
      </div>

      <div className="element-section1" style={{ marginTop: 30 }}>
        <Group position="apart" mb={10}>
          <Text weight={500}>Shapes</Text>
          <Text size="sm" color="blue" style={{ cursor: "pointer" }}>
            View All
          </Text>
        </Group>

        <div className="element-grid1">
          {shapes.map((shape) => (
            <div 
              key={shape.id} 
              className="element-item1" 
              onClick={() => onAddMedia(shape)}
              style={{ 
                padding: "8px", 
                backgroundColor: "#f8f9fa", 
                borderRadius: "4px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {shape.component}
            </div>
          ))}
        </div>
      </div>

      <Button 
        leftSection={<IconPlus size={16} />} 
        variant="subtle" 
        color="gray" 
        fullWidth 
        mt={20}
        style={{ marginBottom: "20px" }}
      >
        Split
      </Button>
    </div>
  );
};

export default ElementsPanel;