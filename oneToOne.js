const Sequelize = require("sequelize");
const { DataTypes, Op } = Sequelize;

const sequelize = new Sequelize("sequelize-practice", "root", "123456", {
  dialect: "mysql",
});

const Country = sequelize.define(
  "country",
  {
    countryName: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  { timestamps: false }
);

const Capital = sequelize.define(
  "capital",
  {
    capitalName: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  { timestamps: false }
);

//Table with foreign key goes in the parathensis
//COuntr y is the source model here
// Model Instance is a Row and a Table
//hasMany gives the method get set create
Country.hasOne(Capital);
Capital.belongsTo(Country);

let country, capital;

//sequelize implements both table together
sequelize
  .sync({ alter: true })
  .then(() => {
    //fetch capitalName
    return Capital.findOne({ where: { capitalName: "Nairobi" } });
    // return Country.findOne({ where: { countryName: "Kenya" } });
  })
  .then((data) => {
    //save fetched capital name
    capital = data;
    // country = data;
    //fetch countryName
    // return Country.findOne({ where: { countryName: "Kenya" } });
    return capital.getCountry();
  })
  .then((data) => {
    //save fetched countryName
    // country = data;
    //link capital to country table where country is the parent and capital is the child.
    // country.setCapital(capital);
    console.log(data.toJSON());
  })
  .catch((err) => {
    console.error(err);
  });

//link capital to country...
