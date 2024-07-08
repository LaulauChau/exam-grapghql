import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider as Provider,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import type { PropsWithChildren } from "react";

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_SERVER_URL}/graphql`,
});

const wsLink = new WebSocketLink({
  options: {
    reconnect: true,
  },
  uri: `ws://${import.meta.env.VITE_SERVER_URL.replace("http://", "")}/graphql`,
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export function ApolloProvider({ children }: PropsWithChildren) {
  return <Provider client={client}>{children}</Provider>;
}
