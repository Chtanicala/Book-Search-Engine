const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models')
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        me: async (parent, args, context, info) => {
            const { username } = context.user;
            return User.findOne({ username }).populate('books')
        }
    },

    Mutation: {

        addUser: async (parent, {username, email, password }) => {
            const user = await User.create({ username, email, password })
            const token = signToken(user);
            return { token, user }
        },

        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});

            if (!user) {
                throw new AuthenticationError('No user found with this email')
            }

            const correctPassword = await user.isCorrectPassword(password);

            if(!correctPassword){
                throw new AuthenticationError('Invalid Credentials')
            }

            const token = signToken(user);

            return { token, user}
        },

        saveBook: async (parent, {book}, context) => {
            const username = context.user.username;
            return User.findOneAndUpdate(
                {username},
                {$addToSet: { savedbooks: book}},
                {new: true}
            )
        },
        
        saveBook: async (parent, {book}, context) => {
            const username = context.user.username;
            return User.findOneAndUpdate(
                {username},
                {$pull: { savedbooks: bookId}},
                {new: true}
            )
        },
    }
}

module.exports = resolvers;
