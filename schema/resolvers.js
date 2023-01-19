const { GraphQLScalarType } = require('graphql');

const { GraphQLError } = require("graphql");

const { User, Pins } = require("../models/user");
// const { Pins } = require("../models/pins");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JSON_SECRET =
  "sdkfjbhbhs(*_)dfbsbdfkjbnksjbdfn!*&%ijbisdjbfikjbisdfjbijbsdifjb28uy345u3i4y59387654389$%@$%#@W";

  const dateScalar = new GraphQLScalarType({
  name: "Date",
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value.toISOString();
  },
});

const resolvers = {
  Query: {
    pins: async () => {
      const pins = await Pins.find({});
      return pins;
    },
    readPin: async (parent, { id }) => {
      const pin = await Pins.findOne({ id });
      return pin;
    },
    userPins: async (parent, { user }) => {
      return await User.findOne({ email: user });
    },
    user: async (parent, { email }) => {
      return await User.findOne({ email });
    },
  },
  Mutation: {
    signIn: async (parent, args) => {
      const { email, password } = args;
      if (typeof email != "string" || !email) {
        throw new GraphQLError("Invalid email", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 400 },
          },
        });
      }
      const user = await User.findOne({ email }).lean();
      if (!user) {
        throw new GraphQLError("User is not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }
      try {
        if (await bcrypt.compare(password, user.password)) {
          // finded the user
          const token = jwt.sign(
            { id: user._id, email: user.email },
            JSON_SECRET
          );
          user.token = token;
        }
      } catch (error) {
        throw new GraphQLError("Invalid Password", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }
      return user;
    },
    signUp: async (parent, args) => {
      const { name, email, password } = args;
      const hashPassword = await bcrypt.hash(password, 10);
      if (typeof name !== "string" || !name) {
        throw new GraphQLError("Invalid Name", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }
      if (typeof password != "string" || !password) {
        throw new GraphQLError("Invalid Password", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }
      if (password.length < 6) {
        throw new GraphQLError("Password is too small", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }
      let user = await User.findOne({ email });
      if (user) {
        throw new GraphQLError("Email is registered", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 400 },
          },
        });
      }
      try {
        const user = await User.create({
          name,
          email,
          password: hashPassword,
        });
        const token = jwt.sign(
          { id: user._id, email: user.email },
          JSON_SECRET
        );
        user.token = token;
        return user;
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 403 },
          },
        });
      }
    },
    createPin: async (parent, args) => {
      const { title, img, description, user } = args.input;
      const id = uuidv4();
      const userpin = {
        title,
        description,
        img,
        user,
        id,
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
        console.error(err);
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

      const result = await Pins.deleteOne({ id }, function (err) {
        if (err) {
          console.error(err);
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
        id,
      };
      const result = await User.updateOne(
        { email: user },
        {
          $push: {
            savedPins: userpin,
          },
        },
        function (err) {
          console.error(err);
        }
      );
    },
    deleteSavedPin: async (parent, args) => {
      const { id, user } = args;
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
        console.error(error);
        res.json({ status: 400, error: "Error in deleted saved pin" });
      }
    },
  },
  Date: dateScalar,

};

module.exports = { resolvers };
