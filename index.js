const Sequelize = require("sequelize");
const { DataTypes } = Sequelize;
const bcrypt = require("bcrypt");
const zlib = require("zlib");

/**
 * new Sequelize(
 *  databaseName,
 *  username,
 *  password,
 *  options
 *  options.host,  //host of DB set by default
 *  options.port,  //Port of DB  set by default
 *  options.dialect  //dialect of DB
 * )
 */
const sequelize = new Sequelize("sequelize-practice", "root", "123456", {
  dialect: "mysql",
});

// sequelize.drop({match: /_test$/})
//sequelize.sync({})

// Create Table In DB using .define()
const User = sequelize.define(
  "user",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 6],
      },
      get() {
        const rawValue = this.getDataValue("username");
        return rawValue.toUpperCase();
      },
    },
    password: {
      type: DataTypes.STRING,
      set(value) {
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(value, salt);
        this.setDataValue("password", hash);
      },
    },
    age: {
      type: DataTypes.INTEGER,
      defaultValue: 21,
      validate: {
        isOldEnough(value) {
          if (value < 21) {
            throw new Error("Too Young");
          }
        },
      },
    },
    WirryCodeRocks: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    description: {
      type: DataTypes.STRING,
      set(value) {
        const compressed = zlib.deflateSync(value).toString("base64");
        this.setDataValue("description", compressed);
      },
      get() {
        const value = this.getDataValue("description");
        const uncompressed = zlib.inflateSync(Buffer.from(value, "base64"));
        return uncompressed.toString();
      },
    },
    aboutUser: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.username}   ${this.description}`;
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isIn: ["me@soccer.org", "me@soccer"],
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    validate: {
      usernamePassMatch() {
        if (this.username === this.password) {
          throw new Error("Password cannot be same as Username");
        } else {
          console.log("Saved");
        }
      },
    },
  }
);

//Using Model Sync to Sync the Model In to Our Database.
User.sync({ alter: true })
  .then((data) => {
    return User.create({
      username: "3333",
      age: 34,
      password: "3333",
      description:
        "Lorem ipson here are the your deiyt sdhdbthjdt Lorem ipson here are the your deiyt sdhdbthjdt Lorem ipson here are the your deiyt sdhdbthjdt",
      email: "me@soccer",
    });
    console.log("Table And Model Sysnc Success");
  })
  .then((data) => {
    // data.forEach((element) => {
    //   console.log(element.toJSON());
    // });
    console.log(data.toJSON());
  })
  .catch((err) => {
    console.error("Error syncing the Table and Model" + err);
  });

//To Check If DB is Connected Use authenticate() which returns a promise
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection Success");
  })
  .catch((err) => {
    console.error("Error Connecting To DB" + err);
  });
