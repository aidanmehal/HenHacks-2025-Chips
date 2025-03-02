import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

// Document here to set up the relationship
import Document from "./Document.js";

const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING, // plain text for demo
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("user", "admin"),
    defaultValue: "user",
  },
}, {
  tableName: "users", // ensures the SQL table name is "users"
  timestamps: true,   
});

// A user has many documents
User.hasMany(Document, {
  foreignKey: "user_id",
  onDelete: "CASCADE", // if a User is deleted, also remove their Documents
});

// Each document belongs to exactly one user
Document.belongsTo(User, {
  foreignKey: "user_id",
});

export default User;


