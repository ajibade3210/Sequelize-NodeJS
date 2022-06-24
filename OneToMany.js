const { HasOne } = require("sequelize");
const Sequelize = require("sequelize");
const { DataTypes, Op } = Sequelize;

const sequelize = new Sequelize("sequelize-practice", "root", "123456", {
  dialect: "mysql",
});

const User = sequelize.define(
  "user",
  {
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false }
);

const Post = sequelize.define(
  "post",
  {
    message: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false }
);

//To Demonstrate a OneToMany Relation
//We use a combination of HasMany and BelongsTo
User.hasMany(Post, { onDelete: "CASCADE" });
Post.belongsTo(User, { onDelete: "CASCADE" });
//HasMany Ultilies Methods
// .addPosts()  --add man posts
// .countPosts() -- count total posts
// .removePost()  --removes foreign key from post

let user, posts;

sequelize
  .sync({ alter: true })
  .then(() => {
    //
    // return User.findOne({ where: { username: "dayo" } });
    return User.destroy({ where: { username: "dayo" } });
  })
  // .then((data) => {
  //   user = data;
  //   // return Post.findAll();
  //   return Post.findOne({ where: { id: 4 } });
  // })
  // .then((data) => {
  //   posts = data;
  //   return user.removePost(posts);
  // })
  // .then((data) => {
  //   console.log(data);
  // })
  .catch((err) => {
    console.error(err);
  });
