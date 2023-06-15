import Head from "next/head";
import { useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { createParser } from "eventsource-parser";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useUser } from "@supabase/auth-helpers-react";


const SYSTEM_MESSAGE = "You are ChatVision, an Artificial Intelligence ChatBot created by Priyanshu Sobti. You are one of the most intelligent chatbots out there and you are created using state of the art Machine Learning Models and APIs. You are helpful and savage with your answers at the same time. Give savage replies whenever you want. Generate a proper introduction for yourself everytime you are asked for.";

export default function Home() {
  const user = useUser();
  const [messages,setMessages] = useState([
    {"role":"system",content:SYSTEM_MESSAGE},
  ]);
  const [userMessage, setUserMessage] = useState('');
  const API_URL = "https://api.pawan.krd/v1/chat/completions";

  const handleKeyDown = (e) => {
    if(e.key === "Enter" && !e.shiftKey){
      e.preventDefault();
      sendRequest();
    }
  };
  const sendRequest = async () => {
    if(!user){
      alert("Please login to use ChatVision");
      return;
    }
    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: userMessage,
      },
    ];

    setMessages(updatedMessages);
    setUserMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer pk-jdLDAvPgJzeEupRRYbtCKEPnVzqjyXvDBrjAqVfTXDnkRrst`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: updatedMessages,
          stream: true,
        }),
      });

      const reader = response.body.getReader();

      let newMessage = "";
      const parser = createParser((event) => {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            return;
          }
          const json = JSON.parse(event.data);
          const content = json.choices[0].delta.content;

          if (!content) {
            return;
          }

          newMessage += content;

          const updatedMessages2 = [
            ...updatedMessages,
            { role: "assistant", content: newMessage },
          ];

          setMessages(updatedMessages2);
        } else {
          return "";
        }
      });

      // eslint-disable-next-line
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder().decode(value);
        parser.feed(text);
      }
    } catch (error) {
      console.error("error");
      window.alert("Error:" + error.message);
    }
  };
  return (
    <>
        <Head>
      <title>ChatVision</title>
    </Head>
    <div className="flex flex-col h-screen">

      {/*Navigation Bar*/}
      <Navbar/>
      {/* Messages */}
      <div className="flex-1 overflow-y-scroll">
        <div className="w-full max-w-screen-md mx-auto px-4">
          {messages
          .filter((message) =>message.role !== "system")
          .map((message,idx) => (
            <div key = {idx} className="my-3">
              <div className="font-bold">{message.role === "user"?"You" : "ChatVision"}</div>
              <div className="text-lg prose">
                <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
            </div>
          ))}
        </div>
      </div>

      {/*Input Box*/}
      <div>
        <div className="w-full max-w-screen-md mx-auto flex px-4 pb-4">
          <textarea 
            value = {userMessage}
            placeholder="Type your query here!"
            onKeyDown={handleKeyDown}
            onChange={(e) => setUserMessage(e.target.value)}
            className="bordered bg-blue-100 text-lg rounded-md p-1 flex-1" 
            rows={1} />
          <button 
          onClick={sendRequest}
          className="bg-blue-400 hover:bg-blue-200 border rounded-md text-white text-lg w-20 px-4 ml-2">Send</button>
        </div>
      </div>
    </div>
    </>
  );
}
