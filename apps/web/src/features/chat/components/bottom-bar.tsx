import { useAuth } from "@clerk/clerk-react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCw, SendHorizontal, ThumbsUp } from "lucide-react";
import { type ChangeEvent, type KeyboardEvent, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { EmojiPicker } from "~/components/emoji-picker";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { useCreateMessage } from "../hooks/use-create-message";

export function ChatBottombar() {
  const { userId } = useAuth();
  const [sendMessage, { loading }] = useCreateMessage();
  const { roomId } = useParams<{ roomId: string }>();
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function handleInputChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setMessage(event.target.value);
  }

  async function handleThumbsUp() {
    if (!roomId || !userId) {
      return;
    }

    const newMessage = {
      content: "👍",
      roomId,
      userId,
    };

    await sendMessage({ variables: { input: newMessage } });
    setMessage("");
  }

  async function handleSend() {
    if (!message.trim() || !roomId || !userId) {
      return;
    }

    const newMessage = {
      content: message.trim(),
      roomId,
      userId,
    };

    await sendMessage({ variables: { input: newMessage } });
    setMessage("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  function handleKeyPress(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => `${prev}\n`);
    }
  }

  return (
    <div className="p-2 flex justify-between w-full items-center gap-2">
      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="w-full relative"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <Textarea
            autoComplete="off"
            value={message}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            name="message"
            placeholder="Aa"
            className=" w-full border rounded-full flex items-center h-9 resize-none overflow-hidden bg-background"
          />
          <div className="absolute right-2 bottom-0.5  ">
            <EmojiPicker
              onChange={(value) => {
                setMessage(message + value);
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
            />
          </div>
        </motion.div>

        {loading ? (
          <RotateCw className="w-6 h-6 animate-spin" />
        ) : message.trim() ? (
          <Button
            className="h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
            size="icon"
            variant="ghost"
            onClick={handleSend}
          >
            <SendHorizontal size={20} className="text-muted-foreground" />
          </Button>
        ) : (
          <Button
            className="h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
            size="icon"
            variant="ghost"
            onClick={handleThumbsUp}
          >
            <ThumbsUp size={20} className="text-muted-foreground" />
          </Button>
        )}
      </AnimatePresence>
    </div>
  );
}
