const mongoose = require("mongoose")
const Schema = mongoose.Schema

const recruiterSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      unique: true,
    },
    company: {
      type: String,
      required: false,
    },
    companyUrl: {
      type: String,
      required: true,
    },
    personalUrl: {
      type: String,
      required: false,
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