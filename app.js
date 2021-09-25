const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 4000;
const uri = process.env.MONGODB_CONNECTION_STRING;

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully.");
});

app.listen(port, () => {
  console.log("Listening for requests on port 4000");
});
