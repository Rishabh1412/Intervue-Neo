"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = " CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
}

const Agent = ({ username, userId, type }: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage>([]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = {
          role: message.role,
          content: message.transcript,
        };

        setMessages((prev) => [...prev, newMessage]);
      }
    };
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: any) => {
      console.error("Vapi Error:", JSON.stringify(error, null, 2));
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) router.push("/");
  }, [messages, callStatus, userId, type]);

 const handleCall = async () => {
  try {
    // Set initial status
    setCallStatus(CallStatus.CONNECTING);
    
    // Validate required parameters
    if (!process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID) {
      throw new Error('Missing workflow ID');
    }
    
    if (!username || !userId) {
      throw new Error('Missing user information');
    }

    // Initialize call with proper error handling
    await vapi.start(
        undefined, // 1. assistant
        undefined, // 2. assistantOverrides
        undefined, // 3. squad
        process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, // 4. workflow
        { // 5. workflowOverrides
          variableValues: {
            username: username,
            userid: userId,
          },
        }
      );

  } catch (error) {
    // Handle errors appropriately
    console.error('Call initialization failed:', error);
    setCallStatus(CallStatus.ERROR);
    // You may want to show an error message to the user here
  }
};


  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    await vapi.stop();
  };

  const latestMessage = messages[messages.length - 1]?.content || "";
  const isCallInactiveOrFinished =
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image src={"/ai-avatar.png"} alt="vapi" width={65} height={54} />
            {isSpeaking && <span className={"animate-speak"}></span>}
          </div>
          <h3>Ai Interviewer</h3>
        </div>
        <div className={"card-border"}>
          <div className={"card-content"}>
            <Image
              src={"/user-avatar.png"}
              alt={"user avatar"}
              height={540}
              width={540}
              className={"rounded-full object-cover size-[120px]"}
            />
            <h3>{username}</h3>
          </div>
        </div>
      </div>
      {messages.length > 0 && (
        <div className={"transcript-border"}>
          <div className={"transcript"}>
            <p
              key={latestMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {latestMessage}
            </p>
          </div>
        </div>
      )}
      <div className={"w-full flex justify-center"}>
        {callStatus !== "ACTIVE" ? (
          <button className={"relative btn-call"} onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />
            <span>{isCallInactiveOrFinished ? "Call" : ". . . "}</span>
          </button>
        ) : (
          <button className={"btn-disconnect"} onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
