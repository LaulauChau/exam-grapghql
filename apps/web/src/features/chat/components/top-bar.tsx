import { RotateCw, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { useDeleteRoom } from "../hooks/use-delete-room";
import { useGetRooms } from "../hooks/use-get-rooms";

export function ChatTopbar() {
  const { roomId } = useParams<{ roomId: string }>();
  const { data } = useGetRooms();
  const roomName = data?.rooms.find((room) => room.id === roomId)?.name;
  const [deleteRoom, { loading }] = useDeleteRoom();
  const navigate = useNavigate();

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
      <Button
        variant="destructive"
        size="icon"
        onClick={async () => {
          try {
            await deleteRoom({ variables: { id: roomId as string } });
            navigate(0);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        {loading ? (
          <RotateCw className="animate-spin" size={20} />
        ) : (
          <Trash2 size={20} />
        )}
      </Button>
    </div>
  );
}
