import { useParams } from "react-router-dom";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { useGetRooms } from "../hooks/use-get-rooms";

export function ChatTopbar() {
  const { roomId } = useParams<{ roomId: string }>();
  const { data } = useGetRooms();
  const roomName = data?.rooms.find((room) => room.id === roomId)?.name;

  return (
    <div className="w-full h-20 flex p-4 justify-between items-center border-b">
      <div className="flex items-center gap-2">
        <Avatar className="flex justify-center items-center">
          <AvatarFallback className="size-10">
            {roomName
              ?.split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{roomName}</span>
        </div>
      </div>
    </div>
  );
}
