import { graphql } from "@repo/graphql";

export const GET_USERS = graphql(/* GraphQL */ `
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`);

export const GET_ROOMS = graphql(/* GraphQL */ `
  query GetRooms($userId: String!) {
    rooms(userId: $userId) {
      id
      name
      users {
        id
        name
      }
    }
  }
`);

export const GET_MESSAGES = graphql(/* GraphQL */ `
  query GetMessages($roomId: String!) {
    messages(roomId: $roomId) {
      id
      content
      createdAt
      user {
        id
        name
        email
      }
    }
  }
`);

export const MESSAGES_SUBSCRIPTION = graphql(/* GraphQL */ `
  subscription MessageCreated($roomId: String!) {
    messageCreated(roomId: $roomId) {
      id
      content
      createdAt
      user {
        id
        name
        email
      }
    }
  }
`);

export const CREATE_MESSAGE = graphql(/* GraphQL */ `
  mutation CreateMessage($input: CreateMessageInput!) {
    createMessage(createMessageInput: $input) {
      id
      content
      createdAt
      room {
        id
      }
      user {
        id
      }
    }
  }
`);

export const CREATE_ROOM = graphql(/* GraphQL */ `
  mutation CreateRoom($input: CreateRoomInput!) {
    createRoom(createRoomInput: $input) {
      id
      name
    }
  }
`);

export const DELETE_ROOM = graphql(/* GraphQL */ `
  mutation DeleteRoom($id: String!) {
    deleteRoom(id: $id) {
      id
    }
  }
`);
