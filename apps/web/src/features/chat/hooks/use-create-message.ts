import { useMutation } from "@apollo/client";

import { CREATE_MESSAGE } from "../graphql";

export function useCreateMessage() {
  return useMutation(CREATE_MESSAGE);
}
