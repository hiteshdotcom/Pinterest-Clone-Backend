const { ApolloServer } = require("apollo-server");
const connectDB = require("./config/db");
const { typeDefs } = require("./schema/type-defs");
const { resolvers } = require("./schema/resolvers");
const server = new ApolloServer({ typeDefs, resolvers });
const { User } = require("./models/user");

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { responsePathAsArray } = require("graphql");
const cors = require("cors");
const fileUpload = require('express-fileupload');



const JSON_SECRET = "sdkfjbhbhs(*_)dfbsbdfkjbnksjbdfn!*&%ijbisdjbfikjbisdfjbijbsdifjb28uy345u3i4y59387654389$%@$%#@W"


const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload({useTempFiles: true}))

connectDB();

app.post("/api/login", async (req,res) => {
    const {email, password} = req.body;
    if(typeof email != 'string' || !email){
        return res.json({status: 400, error: "Invalid email"})
    }
    const user = await User.findOne({email}).lean();
    if(!user){
        return res.json({status: 400, error: "Invalid Username/Password"})
    }
    if(await bcrypt.compare(password, user.password)){
        // finded the user
        const token = jwt.sign({id: user._id, email: user.email}, JSON_SECRET);
        return res.json({status: 200, data: token})
    }
    return res.json({status: 400, error: "Invalid Password"})
})

app.post("/api/register", async (req, res) => {
  const { name, email, password: plainTextPassword } = req.body;
  const password = await bcrypt.hash(plainTextPassword, 10);
  if (typeof name !== "string" || !name) {
    return res.json({ status: 400, error: "Invalid Name" });
  }
  if (typeof plainTextPassword != "string" || !plainTextPassword) {
    return res.json({ status: 400, error: "Invalid Password" });
  }
  if (plainTextPassword.length < 6) {
    return res.json({ status: 400, error: "Password is too small" });
  }
  let user = await User.findOne({email});
  if(user){
    res.json({status: 400,error: "Email is registered"})
  }
  try {
    await User.create({
      name,
      email,
      password,
    });
    return res.json({ status: 200 });
  } catch (error) {
  }
});

server.listen().then(({url}) => {
  console.log(`Your API is running at: ${url} :)`);
})

app.listen(3002, () => {
  console.log("Express server is running on port 3002");
});



