import { useMutation } from "@apollo/client";

import { DELETE_ROOM } from "../graphql";

export function useDeleteRoom() {
  return useMutation(DELETE_ROOM);
}
