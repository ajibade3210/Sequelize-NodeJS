# Sequelize In Node Js...

## Sequelize

This is an Object Relational Mapper(ORM)

- Sequelize is a promise based Node Js ORM.

- ORM is programming technique to write database queries in an object oriented way using your preferred programing language.

Objects In CodeBase --> Mapping Logic --> RelationalDB

In Sequelize We Use Models To represent tables.

- Which are created using `sequelize.define(tableName, schemas)`

## Using Model Sync to Sync the Model In to Our Database.

Sync(options)

### sync()

- creates the table if it doesnt exist.
- Does nothing if it already exists.

### sync({force: true})

- Create the table.
- Drops and Creates a new table first if it already exists.

### sync({alter: true})

- Checks the current state of database (colums it has , their data types etc.)
- Performs neccessary changes in the table to make it match the model.

#### Sequelize automatically puralize our model name to create a Table name using a library call reflection. (use option freezeTableName to remove this default setting)

#### Sequelize Model --->> Table Database

-.build() -- doesnt add any thing to the database, It returns an Object

- .reload() -- return changed data.
- .create() -- create new items. returns an array.
- .save() -- save data to db, only updates field that actually changes.
- data.JSON() -- convert to Json
- data.save({field: ["age"]}) -- would only save changes in age
- .decrement({age: 2}) -- decrease age by 2
- .increment({age: 2}) -- increase age by 2
- .bulkCreate() -- create new items, This returns an array of objects. We have to loop twice to access it data. A con of bulCreate is it doesnt validate the data sent to it, Unlike using Create.
  In other to use validate in bulkCreate we have to set validate option to true. But this Decreases Performance.

```
user.bulkCreate([
    {
        username: "Mike",
        age: 25
    },
    {
         username: "John",
        age: 24
    }
], {validate:  true})
```

- findAll() same as select all in our database

![Logo](https://i.imgur.com/e2rL6Qz.png)

` attributes: [[sequelize.fn("SUM", sequelize.col("age")), "Total Age"]],`
` attributes: [[sequelize.fn("AVG", sequelize.col("age")), "Total Age"]],`
`attributes: {exclude: ['password']}`
`attributes: ['username'], where: {age: 45}`
`User.findAll({order: [['age', 'DESC']]})` //Order By Age Decreasing order
`User.findAll({order: [['age', 'ASC']]})` //Order By Age Increasing order
`User.findAll({rew: true})` // raw acts like .toJSON here returning a Json object.

````
 attributes: [
        "username",
        [sequelize.fn("SUM", sequelize.col("age")), "Total Age"],
      ],
      group: "username",
    });
    ```
````

- User.update({username: "pizza"}, {where: {age: 25 }})
- User.update({username: "Yes!"}, {where: {age: 25 }})
- User.destroy({username: "Yes!"}, {where: {age: 25 }})
- User.destroy({truncate: true}) // Delete every records in Table
- User.sum("age"); //Toatl Age.
- User.max("age") //Maximum Age

- User.findByPk() //find by primary key
- User.findOne({
  where: {age:25}
  })
- User.findOrCreate({}) //create a row on a table if it cant find, Returns and array and a boolean

- User.findAndCountAll({
  where: {username: "mike" },
  raw: true,
  })

## Setters & Getters & Virtual Fields.

### Getters

It Only Affects How The Data Base Is Display Only

```
   get() {
        const rawValue = this.getDataValue("username");
        return rawValue.toUpperCase();
      },
```

### Setters

This is use to alter the DB, It can be used for hashing password.

```
  set(value) {
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(value, salt);
        this.setDataValue("password", hash);
      }
```

#### Using Getters and Setters To compressed and display a table column

```
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
```

## Virtual Fields

VF are fields sequelizes populates under the hood, but they are not stored in our database.

They are useful for displaying custom data.
` type: DataTypes.VIRTUAL,`

## Validation & Constraints

Validation this is a way of validating inputed data.

Custom Validation:

```
 validate: {
        isOldEnough(value) {
          if (value < 21) {
            throw new Error("Too Young");
          }
        },
      },


 validate: {
        myEmailValidator(value) {
          if (value ===  null) {
            throw new Error("Please enter An Email");
          }
        },
      },
```

Built-in Validation:

- isEmail
- isIn //contains
- isNumeric: {message: "You Must Enter A Number"}
- isIn: {
  arg: ["me@soccer.org","my@soccer.com"]
  message:"The provided email must be one of the following..",
  }
- allowNull
-

Model Wide Validation.

This are validation insert as an option for after creating the model.

### Injection and Raw Queries:

RAW QUERIES
Making Queries with Raw Sql Commands. Depending On The Dialect been Used.

`sequelize.query("SELECT * FROM user", {type: Sequelize.QueryTypes.UPDATE})`

SQL INJECTION
When Sqlstatements are inserted into an empty field on an application.
eg. Login(username and password)

Sql Injection allows an attacker to get data, they shouldnt be able to retrieve, drop table and more.

You can prevent Sql injection with sequelize by using bind parameters and replacements.

### Associations In Sql.

These are Relaionship between tables in a database.

These relationship are extablished with foreign keys.

The primary key from parent table appears in foreign key column on child table.

Child table: Table with the foreign key is known as the CHild Table. (cant survive on it own)

Parent Table: This is the table referenced by the child. It is Table whose primary key (id) is being referenced by the child table.

There are 3 types of Associations:

- _One to One_ :- One row on a table can be linked at most with one row in another table eg.Socail Security Number and A person.

In other to decide which table to put the foreign key. First decide which table can exists by itself.

- One to Many.
- Many to Many.

Sequelize
To Create a One to One with Sequelize use

- hasOne()
  .parentTablehasOne(childTable)

-belongTo()
.childTable.belongTo(parentTable))

```
sequelize
  .sync({ alter: true })
  .then(() => {
    //updated
    return Capital.findOne({ where: { capitalName: "Nairobi" } });
  })
  .then((data) => {
    capital = data;
    return Country.findOne({ where: { countryName: "Kenya" } });
  })
  .then((data) => {
    country = data;
    country.setCapital(capital);
  })
  .catch((err) => {
    console.error(err);
  });
```

#### Many To Many.

Association where a child table (join table ) contains two foreign key columns referencing the primary key column of the two parent tables.

Each foreign key colunm can contain multiple occurrences of each foreign keys

Created with belongsToMany() and belongsMany().

child table() -- Table with foreign key column.

parent table - Table whose primary key is being referenced by the child table.

_belongsToMany_ -- childTable.belongsToMany(parentTable)
