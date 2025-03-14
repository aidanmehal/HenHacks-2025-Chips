import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const DocumentFeedback = sequelize.define("DocumentFeedback", {
  feedback_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  // This references the Document that this feedback is for:
  document_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  feedbackText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: "document_feedback",
  timestamps: true,
});

export default DocumentFeedback;


