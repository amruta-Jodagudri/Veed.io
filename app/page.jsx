"use client"

import { useState, useEffect } from "react";
import { Loader, Center } from "@mantine/core";
import WelcomeModal from "@/components/WelcomeModal";
import EditorLayout from "@/components/EditorLayout";
import RecordingInterface from "@/components/RecordingInterface";
import AIInterface from "@/components/AIInterface";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [editorMode, setEditorMode] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showRecording, setShowRecording] = useState(false);
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleStartEditor = (mode, file = null) => {
    setEditorMode(mode);

    if (file) {
      const fileType = file.type.split('/')[0];
      const mediaObject = {
        id: `file-${Date.now()}`,
        type: fileType,
        src: URL.createObjectURL(file),
        name: file.name,
        file: file,
        duration: fileType === 'video' || fileType === 'audio' ? 0 : 10
      };
      setUploadedFile(mediaObject);
    }

    if (mode === "record") {
      setShowRecording(true);
      setShowWelcome(false);
    } else if (mode === "ai") {
      setShowAI(true);
      setShowWelcome(false);
    } else {
      setShowWelcome(false);
    }
  };

  const handleRecordingComplete = (recordedMedia) => {
    setShowRecording(false);
    if (recordedMedia) {
      setUploadedFile({
        ...recordedMedia,
        type: "video",
        startTime: 0,
        endTime: recordedMedia.duration || 10
      });
    }
  };

  const handleAIComplete = (generatedMedia) => {
    setShowAI(false);
    if (generatedMedia) {
      setUploadedFile({
        ...generatedMedia,
        startTime: 0,
        endTime: generatedMedia.duration || 10
      });
    }
  };

  if (loading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="xl" color="indigo" />
      </Center>
    );
  }

  if (showRecording) {
    return <RecordingInterface onComplete={handleRecordingComplete} />;
  }

  if (showAI) {
    return <AIInterface onComplete={handleAIComplete} />;
  }

  return (
    <main style={{ height: "100vh", width: "100vw" }}>
      {showWelcome ? (
        <WelcomeModal onStart={handleStartEditor} />
      ) : (
        <EditorLayout 
          mode={editorMode} 
          initialMedia={uploadedFile}
          onBack={() => {
            setShowWelcome(true);
            setUploadedFile(null);
          }}
        />
      )}
    </main>
  );
}