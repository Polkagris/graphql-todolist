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

// dummy data
const todos = [
  { title: "Walk dog", completed: false, id: "1", userId: "2" },
  { title: "Make dinnar", completed: false, id: "2", userId: "1" },
  { title: "Go shopping", completed: false, id: "3", userId: "3" },
  { title: "Take out trizash", completed: false, id: "4", userId: "1" },
  { title: "Run", completed: false, id: "5", userId: "2" },
  { title: "Work, work", completed: false, id: "6", userId: "3" },
];

const users = [
  { name: "Arny Tester", role: "user", id: "1" },
  { name: "Rebecca Thest", role: "user", id: "2" },
  { name: "Cecil Tizche", role: "user", id: "3" },
];

const TodoType = new GraphQLObjectType({
  name: "Todo",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
    user: {
      type: UserType,
      resolve(parent, args) {
        console.log(`parent`, parent);
        // find user associated with that todo
        return users.filter((user) => parent.userId == user.id)[0];
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
        console.log(
          `todos`,
          todos.filter((todo) => parent.id == todo.userId)
        );
        return todos.filter((todo) => parent.id == todo.userId);
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
        // code to get data from db / other source
        return todos.filter((todo) => todo.id == args.id)[0];
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        // code to get data from db
        return users.filter((user) => user.id == args.id)[0];
      },
    },
    todos: {
      type: new GraphQLList(TodoType),
      resolve(parent, args) {
        return todos;
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return users;
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
