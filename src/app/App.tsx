"use client"
import React, { useEffect, useState } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { SpeechToText } from './SpeechRecognition';

interface JsonStoredData {
  StartingDate: Date | null;
  EndingDate: Date | null;
  Persons: string | null;
  Location: string | null;
  ChildCount: number | null;
  AdultCount: number | null;
  Transcript: string | null;
}

const Test = () => {
  const [text, setText] = useState('');
  const key: string = process.env.NEXT_PUBLIC_OPENAI_KEY || '';
  const {listening,transcript,browserSupportsSpeechRecognition, resetTranscript} = useSpeechRecognition();
  console.log("Is Listening", listening);
  console.log("transcript", transcript);
  console.log("browserSupportsSpeechRecognition", browserSupportsSpeechRecognition)
  const [jsonStoredData, setJsonStoredData] = useState<JsonStoredData>({
    StartingDate: null,
    EndingDate: null,
    Persons: null,
    Location: null,
    ChildCount: null,
    AdultCount: null,
    Transcript: null,
  });
 
  useEffect(() => {
   console.log(jsonStoredData);
  }, [jsonStoredData])

  console.log("browserSupportsSpeechRecognition", browserSupportsSpeechRecognition);
  console.log("--------------------------");
  console.log("Json data", jsonStoredData);
  console.log("--------------------------")

  
  return (
    <div>
      <SpeechToText
        apiKey={key}
        SpeechRecognition={SpeechRecognition}
        resetTranscript={resetTranscript}
        browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
        transcript={transcript}
        setJsonStoredData={setJsonStoredData}
        mic_color=""
        mic_bg_color='#ee121d50'
        listening={listening}
        setText = {setText}
        text = {text}
      />
    </div>
  );
};

export default Test;
