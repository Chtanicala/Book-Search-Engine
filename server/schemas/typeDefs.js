const {gqp} = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]!
    }
    
    type Book {
        _id: ID
        authors: [String]!
        description: String!
        bookId: ID!
        title: String!
        image: String
        link: String
    }

    type Query {
        me: User
    }
    
    type Auth {
        token: ID!
        user: User
    }

    input AddBook {
        authors: [String]!
        description: String!
        bookId: ID!
        title: String!
        image: String
        link: String
    }
    
    type Mutation {
        loginUser(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(book: AddBook!): User
        removeBook(bookId: ID!): User
    }`