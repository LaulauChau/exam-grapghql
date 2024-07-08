import { useQuery } from "@apollo/client";

import { GET_USERS } from "../graphql";

export function useGetUsers() {
  return useQuery(GET_USERS);
}
