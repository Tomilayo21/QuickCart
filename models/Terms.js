// models/Terms.js
import mongoose from "mongoose";

const TermsSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Terms || mongoose.model("Terms", TermsSchema);
