import { useMutation } from "@apollo/client";

import { CREATE_ROOM } from "../graphql";

export function useCreateRoom() {
  return useMutation(CREATE_ROOM);
}
