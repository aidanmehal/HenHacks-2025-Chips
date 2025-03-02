import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,    // e.g. 'lldb'
  process.env.DB_USER,    // e.g. 'zackarybedwell'
  process.env.DB_PASSWORD,  
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: process.env.DB_PORT || 5432,
    logging: false, // for debugging SQL
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection to the database established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
testConnection();

export default sequelize;
