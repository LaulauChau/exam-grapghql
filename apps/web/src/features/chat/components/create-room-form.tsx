import { useAuth } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCw, SquarePen } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useCreateRoom } from "../hooks/use-create-room";
import { useGetUsers } from "../hooks/use-get-users";

const formSchema = z.object({
  name: z.string(),
  users: z.string(),
});

export function CreateRoomForm() {
  const { userId } = useAuth();
  const [createRoom, { loading }] = useCreateRoom();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: "",
      users: "",
    },
    resolver: zodResolver(formSchema),
  });
  const { data } = useGetUsers();
  const navigate = useNavigate();

  async function handleCreateRoom(values: z.infer<typeof formSchema>) {
    if (!userId) {
      return;
    }
    try {
      await createRoom({
        variables: {
          input: {
            name: values.name,
            userIds: [userId, values.users],
          },
        },
      });

      navigate(0);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="size-9" size="icon" variant="ghost">
          <SquarePen size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateRoom)}>
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Create a room</h4>
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3 items-center gap-4">
                      <FormLabel>Room name</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-2 h-8"
                          placeholder="Room name"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 items-center gap-4">
                  <FormField
                    control={form.control}
                    name="users"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Users</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a user" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {data?.users
                                .filter((user) => user.id !== userId)
                                .map((user) => (
                                  <SelectItem key={user.id} value={user.id}>
                                    {user.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <Button
                    className="col-span-3"
                    disabled={loading}
                    type="submit"
                  >
                    {loading && (
                      <RotateCw className="ml-4 animate-spin" size={20} />
                    )}
                    Create room
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
