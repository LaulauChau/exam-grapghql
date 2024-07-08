import { useSubscription } from "@apollo/client";
import { useAuth } from "@clerk/clerk-react";
import { AnimatePresence, motion } from "framer-motion";
import { GetMessagesQuery } from "node_modules/@repo/graphql/src/gql/graphql";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { cn } from "~/libs/utils";
import { MESSAGES_SUBSCRIPTION } from "../graphql";
import { useGetMessages } from "../hooks/use-get-messsages";
import { ChatBottombar } from "./bottom-bar";

export function ChatList() {
  const { userId } = useAuth();
  const { roomId } = useParams<{ roomId: string }>();
  const { data } = useGetMessages(roomId ?? "");
  const [messages, setMessages] = useState<GetMessagesQuery["messages"]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: So that it scrolls to the bottom when a new message is added
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages.length]);

  useEffect(() => {
    if (data) {
      setMessages(data.messages);
    }
  }, [data]);

  useSubscription(MESSAGES_SUBSCRIPTION, {
    variables: { roomId: roomId ?? "" },
    onSubscriptionData: ({ subscriptionData }) => {
      const newMessage = subscriptionData.data?.messageCreated;

      if (newMessage) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    },
  });

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
      <div
        ref={messagesContainerRef}
        className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                "flex flex-col gap-2 p-4 whitespace-pre-wrap",
                message.user.id !== userId ? "items-end" : "items-start",
              )}
            >
              <div className="flex gap-3 items-center">
                {message.user.id === userId && (
                  <Avatar className="flex justify-center items-center">
                    <AvatarFallback>
                      {(message.user.name ?? message.user.email)
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}
                <span className=" bg-accent p-3 rounded-md max-w-xs">
                  {message.content}
                </span>
                {message.user.id !== userId && (
                  <Avatar className="flex justify-center items-center">
                    <AvatarFallback>
                      {(message.user.name ?? message.user.email)
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <ChatBottombar />
    </div>
  );
}
