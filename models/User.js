const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

//Document here to set up the relationship
const Document = require("./Document");

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
    type: DataTypes.STRING, // for a demo, plain text is fine
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("user", "admin"),
    defaultValue: "user",
  },
}, {
  tableName: "users",       // Ensures the SQL table name is exactly "users"
  timestamps: true,         // Automatically adds createdAt and updatedAt fields
});

// A user has many documents
User.hasMany(Document, {
  foreignKey: "user_id",
  onDelete: "CASCADE",  // If a User is deleted, also remove their Documents
});

// Each document belongs to exactly one user
Document.belongsTo(User, {
  foreignKey: "user_id",
});

module.exports = User;

