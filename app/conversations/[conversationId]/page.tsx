"use client";
import { useEffect, useState } from 'react'
import { useParams } from "next/navigation";
import MessageList from '../components/MessageList'
import ChatInput from '../components/ChatInput'
import Header from '../components/Header';
import { Conversation } from '@/constants';
import { useSocket } from "@/app/contexts/SocketContext";
import { useUserContext } from "@/app/contexts/UserContext";
import { Message as MessageType } from "@/constants";
const ConversationPage = () => {
  const socket = useSocket();
   const { conversationId } = useParams();
    const { user } = useUserContext();
   const [conversation, setConversation] = useState<Conversation>();
   const [messages, setMessages] = useState<MessageType[]>([]);
   useEffect(() => {
       if (!user || !socket) return;
   
       socket.emit('joinConversation', conversationId);
   
       socket.on('newMessage', (message) => {
        console.log('Tin nhắn mới:', message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });
   
       return () => {
         socket.off("newMessage");
       };
     }, [socket, user, conversationId]);
   useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await fetch(`/api/message/${conversationId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        console.log("messages", data.data);
        setMessages(data.data)
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
     const fetchConversationId = async () => {
       try {
         const response = await fetch(`/api/conversation/${conversationId}`);
         const data = await response.json();
         setConversation(data.data);
         console.log("conversation", data.data);
       } catch (error) {
         console.error("Failed to fetch conversation:", error);
       }
     };
     fetchConversationId();
      getMessages();

   }, [conversationId]);

   const handleSendMessage = async (message: string) => {
     try {
       const response = await fetch(`/api/message`, {
         method: "POST",
         body: JSON.stringify({ conversationId, content: message }),
       });
       const data = await response.json();
       console.log("send message", data.data);
     } catch (error) {
       console.error("Failed to send message:", error);
     }
   };

   if(!conversation || !messages) {
     return (
       <div className="flex flex-col  flex-grow p-3">
         <div className="flex-grow">
           <p>Conversation ID is required</p>
         </div>
       </div>
     );
   }
  return (
    <>
      <div className="sticky top-0 bg-white z-10 shadow-sm border-b">
            <Header data={conversation}/>
          </div>
          <div className="flex flex-col  flex-grow p-3">
            <div className="flex-grow">
                <MessageList 
                messages={messages}
                  messageCreationTime={conversation.createdAt}
                />
            </div>
          </div>

          <div className="sticky bottom-0 bg-white z-10 shadow-sm ">
            <ChatInput onSubmit={handleSendMessage}/>
          </div>
    </>
  )
}

export default ConversationPage