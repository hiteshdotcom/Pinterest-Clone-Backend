var { gql } = require('apollo-server');

const typeDefs = gql(`

  scalar Date 
  type FollowUser {
    id: ID
    name: String!
  }
  type Comment {
    id: ID!
    message: String!
    createdAt: Date!
    UpdatedAt: Date!
    user: User
    userId: String
    pin: Pin
    pinId: ID!
    parent: Comment
    children: [Comment]
    parentId: ID
  }
  type Like {
    user: User
    comment: Comment
    userId: ID!
    commentId: ID!
  }
 
  type User {
    id: ID
    name: String
    email: String!
    token: String!
    password: String!
    savedPins: [Pin]
    myPins: [Pin]
    gender: String!
    country: String!
    language: String!
    profile_img: String!
    following: [FollowUser]
    followers: [FollowUser]
    about: String
    comments: [Comment]
    likes: [Like]
  }
  type Pin {
    id: ID
    title: String!
    description: String!
    img: String!
    user: String
    tags: [String]
    comments: [Comment]
  }

  type Query {
    user (email: String!): User!
    pins: [Pin]
    readPin (id: ID!): Pin
    userPins (user: String!): User
  }
  input CreatePinInput{
    title: String!
    description: String!
    img: String!
    user: String!
    id: ID
  }
  type Mutation{
    signUp (name: String, email: String, password: String ): User
    signIn (email: String, password: String): User
    createPin (input: CreatePinInput!): Pin
    deletePin (id: ID!, user: String!): Pin
    savedPin (input: CreatePinInput!): Pin
    deleteSavedPin(id: ID!, user: String!): Pin
  }
`);

module.exports = { typeDefs };
