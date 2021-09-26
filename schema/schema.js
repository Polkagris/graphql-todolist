const grapghql = require("graphql");
const User = require("../models/user");
const Todo = require("../models/todo");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLSchema,
  GraphQLList,
} = grapghql;

const TodoType = new GraphQLObjectType({
  name: "Todo",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
    userId: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    role: { type: GraphQLString },
    todos: {
      type: new GraphQLList(TodoType),
      resolve(parent, args) {
        // find todos associated with that user
        return Todo.find({ userId: parent.id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    todo: {
      type: TodoType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Todo.findById(args.id);
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        // code to get data from db
        return User.findById(args.id);
      },
    },
    todos: {
      type: new GraphQLList(TodoType),
      resolve(parent, args) {
        return Todo.find({});
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
      },
      resolve(parent, args) {
        let user = new User({
          name: args.name,
          role: "user",
        });
        return user.save();
      },
    },
    addTodo: {
      type: TodoType,
      args: {
        title: { type: GraphQLString },
        userId: { type: GraphQLID },
        completed: { type: GraphQLBoolean },
      },
      resolve(parent, args) {
        let todo = new Todo({
          title: args.title,
          completed: false,
          userId: args.userId,
          createdTime: Date.now(),
        });
        return todo.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
