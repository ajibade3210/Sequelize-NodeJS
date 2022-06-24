const Sequelize = require("sequelize");
const { DataTypes, Op } = Sequelize;

const sequelize = new Sequelize("sequelize-practice", "root", "123456", {
  dialect: "mysql",
});

const Customer = sequelize.define(
  "customer",
  {
    customerName: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false }
);

const Product = sequelize.define(
  "product",
  {
    productName: { type: DataTypes.STRING },
  },
  { timestamps: false }
);

const CustomerProduct = sequelize.define(
  "customerproduct",
  {
    customerproductId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  { timestamps: false }
);

//We need a Junction model
//when creating a manyTomany Relationship.
//creates a new table join table.
Customer.belongsToMany(Product, { through: CustomerProduct });
Product.belongsToMany(Customer, { through: CustomerProduct });
//The ultily method provided by belongsToMany is exactly the same to HASMany

let customer, product;

sequelize
  .sync({ alter: true })
  .then(() => {
    //
    return Product.findOne({ where: { productName: "laptop" } });
    
})
//   .then((data) => {
//     product = data;
//     return Customer.findAll();
//   })
//   .then((data) => {
//     customer = data;
//     product.addCustomers(customer);
//   })
  .catch((err) => {
    console.error(err);
  });
