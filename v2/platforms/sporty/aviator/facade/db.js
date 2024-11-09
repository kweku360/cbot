const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("cbotdb", "kweku", "", {
  host: "localhost",
  dialect: "postgres",
  logging: false, // Set to true to log SQL queries
});

//define Logs model
const Logs = sequelize.define(
  "logs",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    platform: {
      type: DataTypes.STRING,
    },
    number: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.STRING,
    },
    data: {
      type: DataTypes.JSONB,
    },
  },
  { freezeTableName: true }
);

DbApi = {};

DbApi.test = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

DbApi.addLog = async (logObj) => {
  try {
    const [instance, created] = await Logs.findOrCreate({
      where: {
        id: logObj.id,
      },
      defaults: logObj,
    });

    if (created) {
      console.log("New record created:", instance.toJSON());
    } else {
      const newData = instance.data;
      newData.push(logObj.data[0]);
      await Logs.update(
        { data: newData },
        {
          where: {
            id: logObj.id,
          },
        }
      );
     // console.log("Record updated");
    }
  } catch (error) {
    console.error("Error:", error);
  }
  //   const newLog = await Logs.create(logObj);
  //   console.log("Added log", newLog);
};

//Logs
DbApi.currentDay = async (req,res) => {
  try {
    const currentLog = await Logs.findByPk(generateId());
    if (currentLog === null) {
      res.json({status:"Log not found"})
    } else {
        res.json(currentLog.toJSON())
    }
  } catch (error) {
    console.error("unable to get data", error);
  }
};

DbApi.getByDay = async (req,res) => {
    try {
      const date  = req.params.date
      const currentLog = await Logs.findByPk(generateId(date));
      if (currentLog === null) {
        res.json({status:"Log not found"})
      } else {
          res.json(currentLog.toJSON())
      }
    } catch (error) {
      console.error("unable to get data", error);
    }
  };

const generateId = (date="") => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yy = String(today.getFullYear()).slice(-2);
  const formattedToday = date == "" ? dd + mm + yy : date;
  const id = formattedToday + process.env.PLATFORM + process.env.ACCNUMBER;
  return id;
};

module.exports = DbApi;
