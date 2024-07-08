import { ChatList } from "./list";
import { ChatTopbar } from "./top-bar";

export function Chat() {
  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar />

      <ChatList />
    </div>
  );
}
