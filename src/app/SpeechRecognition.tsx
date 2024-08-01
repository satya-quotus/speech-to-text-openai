"use client"
import React, { useEffect, useState, useMemo } from "react";
import { OpenAI } from "openai";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons'

interface SpeechToTextProps {
    apiKey: string;
    SpeechRecognition: any;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
    transcript: string;
    setJsonStoredData: any;
    mic_color?: string;
    mic_bg_color?: string;
    listening: boolean;
    setText: any;
    text: any;
}

export function SpeechToText({ text, setText, listening, apiKey, mic_bg_color, SpeechRecognition, resetTranscript, browserSupportsSpeechRecognition, transcript, setJsonStoredData, mic_color }: SpeechToTextProps) {
    const [isListening, setIsListening] = useState<boolean>(false);
    const openai = useMemo(() => {
        return new OpenAI({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true,
        });
    }, [apiKey]);

    useEffect(() => {
        if (isListening) {
            SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
        } else {
            SpeechRecognition.stopListening();
            fetchData(text);
            // resetTranscript();
        }
    }, [isListening]);

    useEffect(() => {
        setText(transcript);
    }, [transcript])

    useEffect(() => {
        if (!listening) {
            setIsListening(false);
        }
    }, [listening]);


    const fetchData = async (transcript: string) => {
        try {
            const startingDateCompletion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content:
                            transcript +
                            "Extract only the starting date from the provided content. If the user specifies a duration like '2 days' or '3 days', set the starting date to today. If no starting date is found in content and no duration is specified, provide only a single word null. Do not provide any additional information or results. Ensure the date format is in numbers and not in words like (01-jan-2024).Always provide data only date format do not want any text included with date either date or null",
                    },
                ],
                model: "gpt-3.5-turbo",
            });
            const startingDate = startingDateCompletion.choices[0].message.content;

            const endingDateCompletion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content:
                            transcript +
                            "Extract only the ending date from the provided content. If the user specifies a duration like '2 days' or '3 days', set the ending date to the specified number of days in the future. If no ending date is found in content and no duration is specified, provide only a single word null. Do not provide any additional information or results. Ensure the date format like (DD-MM-YYYY).Always provide data only date format do not want any text included with date either date or null",
                    },
                ],
                model: "gpt-3.5-turbo",
            });
            const endingDate = endingDateCompletion.choices[0].message.content;

            const personsCompletion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: transcript + "Extract the persons from the text , output should be only one number . If no persons are found, provide the number '0'. Do not provide any additional information or results.",
                    },
                ],
                model: "gpt-3.5-turbo",
            });
            const persons = personsCompletion.choices[0].message.content;

            const locationCompletion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: transcript + "Extract only location name from the text . Do not provide any additional information or results. If no location is found in content, provide a single word null . Do not provide any additional information or results.",
                    },
                ],
                model: "gpt-3.5-turbo",
            });
            const location = locationCompletion.choices[0].message.content;

            const childCountCompletion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content:
                            transcript +
                            "Please extract the number of childs from the text. If no childs are found, provide the number '0'. Do not provide any additional information or results.",
                    },
                ],
                model: "gpt-3.5-turbo",
            });
            const childCount = childCountCompletion.choices[0].message.content;

            const adultCountCompletion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content:
                            transcript +
                            "Please extract the number of adults from the text. If no adults are found, provide the number '0'. Do not provide any additional information or results.",
                    },
                ],
                model: "gpt-3.5-turbo",
            });
            const adultCount = adultCountCompletion.choices[0].message.content;

            setJsonStoredData({
                StartingDate: startingDate,
                EndingDate: endingDate,
                Persons: persons,
                Location: location,
                ChildCount: childCount,
                AdultCount: adultCount,
                Transcript: transcript,
            });
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };



    // if (!browserSupportsSpeechRecognition) {
    //     return <div>Your browser does not support speech recognition.</div>;
    // }

    return (
        <>
            <>
                <div style={{ position: "relative", display: "inline-block", fontFamily: "serif" }}>
                    <button onClick={() => setIsListening(!isListening)} style={{ border: "none", background: "transparent", fontSize: "25px", position: "relative" }}>
                        <FontAwesomeIcon icon={faMicrophone} style={{ color: mic_color || 'brown' }} />
                        {listening && (
                            <style>
                                {`
          button::before,
          button::after {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: ${mic_bg_color};
            transform: scale(1.4);
            z-index: -2;
            top: 0;
            left: 0;
            border-radius: 50%;
            animation: anim-btn 2s linear infinite;
          }
  
          button::after {
            animation-delay: 0.8s;
          }
  
          @keyframes anim-btn {
            from {
              transform: scale(1);
            }
            to {
              transform: scale(1.8);
            }
          }
        `}
                            </style>
                        )}
                    </button>
                     <br />
                     <br />
                     <br />
                    <button onClick={()=> fetchData(transcript)} style={{
                        border:"2px solid red",
                        padding:"2px"
                    }} >Fetch Data</button>
                </div>
            </>
        </>
    );
};