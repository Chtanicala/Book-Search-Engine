const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models')
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        me: async (parent, args, context, info) => {
            const { username } = context.user;
            return User.findOne({ username }).populate('books')
        }
    },

    Mutation: {

        addUser: async (parent, args) => {
            const user = await User.create(args)
            const token = signToken(user);
            return { token, user }
        },

        loginUser: async (parent, {email, password}) => {
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

        saveBook: async (parent, { bookData }, context) => {
          if (context.user) {
            const updatedUser = await User.findByIdAndUpdate(
              { _id: context.user._id },
              { $push: { savedBooks: bookData } },
              { new: true }
            );
    
            return updatedUser;
          }
    
          throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async (parent, { bookId }, context) => {
          if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
              { _id: context.user._id },
              { $pull: { savedBooks: { bookId } } },
              { new: true }
            );
    
            return updatedUser;
          }
    
          throw new AuthenticationError('You need to be logged in!');
        },
    }
}

module.exports = resolvers;
