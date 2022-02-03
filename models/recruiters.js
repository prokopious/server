const mongoose = require("mongoose")
const Schema = mongoose.Schema

const recruiterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    company: {
      type: String,
      required: true,
    },
    companyUrl: {
      type: String,
      required: true,
    },
    personalUrl: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

var Recruiters = mongoose.model('Recruiter', recruiterSchema)

module.exports = Recruiters