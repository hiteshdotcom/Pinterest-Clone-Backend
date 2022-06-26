const { User, Pins } = require("../models/user");
// const { Pins } = require("../models/pins");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const resolvers = {
  Query: {
    pins: async () => {
      const pins = await Pins.find({});
      return pins;
    },
    readPin: async (parent, { id }) => {
      const pin = await Pins.findOne({ id});
      return pin;
    },
    userPins: async (parent, { user }) => {
      return await User.findOne({ email: user });
    },
  },
  Mutation: {
    createPin: async (parent, args) => {
      const { title, img, description, user } = args.input;
      const id = uuidv4();
      const userpin = {
        title,
        description,
        img,
        user,
        id
      };
      try {
        const result = await User.updateOne(
            { email: user },
            {
              $push: {
                myPins: userpin,
              },
            }
          );
        const pinresult = await Pins.create(userpin);
      } catch (error) {
        console.log(err)
        
      }

    },
    deletePin: async (parent, { id, user }) => {
      const userresult = await User.updateOne(
        { email: user },
        {
          $pull: {
            myPins: { id },
          },
        }
      );

      const result = await Pins.deleteOne({  id }, function (err) {
        if (err) {
          console.log(err);
        }
      });
      return userresult;
    },
    savedPin: async (parent, args) => {
      const { title, img, description, user, id } = args.input;
      const userpin = {
        title,
        description,
        img,
        user,
        id
      };
      const result = await User.updateOne(
        { email: user },
        {
          $push: {
            savedPins: userpin,
          },
        }, function (err) {
          console.log(err)
        }
      );

 
    },
    deleteSavedPin: async(parent, args) => {
      const {id, user} = args;
      try {
          const result = await User.updateOne(
            { email: user },
            {
              $pull: {
                savedPins: { id },
              },
            }
          );
          return result;
      } catch (error) {
        console.log(error);
        res.json({status:400, error:"Error in deleted saved pin"})
      }
    }
  },
};

module.exports = { resolvers };
