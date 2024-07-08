import { useQuery } from "@apollo/client";
import { useAuth } from "@clerk/clerk-react";

import { GET_ROOMS } from "../graphql";

export function useGetRooms() {
  const { userId } = useAuth();

  return useQuery(GET_ROOMS, {
    variables: {
      userId: userId ?? "",
    },
  });
}
