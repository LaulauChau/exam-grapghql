import { useAuth } from "@clerk/clerk-react";
import { SquarePen } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useCreateRoom } from "../hooks/use-create-room";
import { useGetUsers } from "../hooks/use-get-users";

export function CreateRoomForm() {
  const { userId } = useAuth();
  const { data } = useGetUsers();
  const [createRoom] = useCreateRoom();

  const [roomName, setRoomName] = useState<string>("");
  const [users, setUsers] = useState<string[]>([]);

  async function handleCreateRoom() {
    if (!userId) {
      return;
    }

    await createRoom({
      variables: {
        input: {
          name: roomName,
          userIds: [userId, ...users],
        },
      },
    });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="size-9" size="icon" variant="ghost">
          <SquarePen size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Create a room</h4>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="name">Room name</Label>
              <Input
                id="name"
                defaultValue={roomName}
                className="col-span-2 h-8"
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Select
                onValueChange={(value) => setUsers((prev) => [...prev, value])}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {data?.users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Button className="col-span-3" onClick={handleCreateRoom}>
                Create room
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
