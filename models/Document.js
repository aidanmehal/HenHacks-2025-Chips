import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

// DocumentFeedback here so we can set up the 1:1 relationship
import DocumentFeedback from "./DocumentFeedback.js";

const Document = sequelize.define("Document", {
  document_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  categories: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  tableName: "documents",
  timestamps: true,
});

// A document has one feedback (1:1)
Document.hasOne(DocumentFeedback, {
  foreignKey: "document_id",
  onDelete: "CASCADE", // if a Document is removed, also remove its Feedback
});

// Feedback belongs to a single document
DocumentFeedback.belongsTo(Document, {
  foreignKey: "document_id",
});

export default Document;