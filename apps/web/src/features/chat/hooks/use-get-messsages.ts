import { useQuery } from "@apollo/client";

import { GET_MESSAGES } from "../graphql";

export function useGetMessages(roomId: string) {
  return useQuery(GET_MESSAGES, {
    variables: {
      roomId,
    },
  });
}
