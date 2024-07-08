import { UserButton } from "@clerk/clerk-react";
import { Link, useParams } from "react-router-dom";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { buttonVariants } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { CreateRoomForm, useGetRooms } from "~/features/chat";
import { cn } from "~/libs/utils";

type SidebarProps = {
  isCollapsed: boolean;
  onClick?: () => void;
};

export function Sidebar({ isCollapsed }: SidebarProps) {
  const { roomId } = useParams<{ roomId: string }>();
  const { data } = useGetRooms();

  return (
    <div
      data-collapsed={isCollapsed}
      className="relative group flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 "
    >
      {!isCollapsed && (
        <div className="flex justify-between p-2 items-center">
          <div className="flex gap-2 items-center text-2xl">
            <p className="font-medium">Chats</p>
            <span className="text-zinc-300">({data?.rooms.length ?? 0})</span>
          </div>

          <div className="flex items-center gap-4">
            <UserButton />
            <CreateRoomForm />
          </div>
        </div>
      )}

      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {data?.rooms.map((room) =>
          isCollapsed ? (
            <TooltipProvider key={room.name}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to={`/${room.id}`}
                    className={cn(
                      buttonVariants({
                        size: "icon",
                        variant: room.id === roomId ? "outline" : "ghost",
                      }),
                      "h-11 w-11 md:h-16 md:w-16",
                      room.id === roomId &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                    )}
                  >
                    <Avatar className="flex justify-center items-center">
                      <AvatarFallback className="size-10">
                        {room.name
                          ? room.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "R"}
                      </AvatarFallback>
                    </Avatar>{" "}
                    <span className="sr-only">{room.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {room.name ?? room.users.map((user) => user.name).join(", ")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link
              key={room.id}
              to={`/${room.id}`}
              className={cn(
                buttonVariants({
                  size: "xl",
                  variant: room.id === roomId ? "outline" : "ghost",
                }),
                "justify-start gap-4",
                room.id === roomId &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white shrink",
              )}
            >
              <Avatar className="flex justify-center items-center">
                <AvatarFallback className="size-10">
                  {room.name
                    ? room.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "R"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col max-w-28">
                <span>
                  {room.name ?? room.users.map((user) => user.name).join(", ")}
                </span>
              </div>
            </Link>
          ),
        )}
      </nav>
    </div>
  );
}
