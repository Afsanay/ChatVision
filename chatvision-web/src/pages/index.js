import Head from "next/head";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";


export default function Home() {


const API_URL = "https://api.pawan.krd/v1/chat/completions";

const SYSTEM_MESSAGE = "You are ChatVision, an Artificial Intelligence ChatBot created by Priyanshu Sobti. You are one of the most intelligent chatbots out there and you are created using state of the art Machine Learning Models and APIs. You are helpful and savage with your answers at the same time. Give savage replies whenever you want. Generate a proper introduction for yourself everytime you are asked for.";

const [userMessage,setUserMessage] = useState("");
const [messages,setMessages] = useState([{"role":"system","content":SYSTEM_MESSAGE}]);

async function sendRequest() {

  const newmessage = {role:"user",content:userMessage};
  const newMessages = [...messages,newmessage];
  setMessages(newMessages);
  setUserMessage("");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer pk-jdLDAvPgJzeEupRRYbtCKEPnVzqjyXvDBrjAqVfTXDnkRrst`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: newMessages,
    }),
  });
  const responseJson = await response.json();
  const newbotMessage = responseJson.choices[0].message;
  const newMess = [...newMessages,newbotMessage];
  setMessages(newMess);
}


  return (
    <>
    <Head>
      <title>ChatVision</title>
    </Head>
    <div className="flex flex-col h-screen">
      {/*Navigation Bar*/}
      <Navbar/>
      {/*Message History*/}
      <div className="flex-1 overflow-y-scroll">
        <div className=" w-full max-w-screen-md mx-auto px-4">
          {messages
          .filter((message)=>message.role !== "system")
          .map((message,idx) => (
            <div key ={idx} className="mt-3">
            <div className="font-bold">{message.role === "user"?"You":"ChatVision"}</div>
            <div className="text-lg prose">
              <ReactMarkdown>
                {message.content}
              </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/*Input Box*/}

      <div>
        <div className="w-full max-w-screen-md mx-auto flex">
          <textarea value={userMessage} onChange={(e)=>setUserMessage(e.target.value)} className="border rounded-md text-lg p-1 flex-1" rows={1}/>
          <button onClick={sendRequest} className="bg-blue-500 hover:bg-blue-600 w-20 p-2 ml-2">Submit</button>
        </div>
      </div>
    </div>
    </>
  );
}
