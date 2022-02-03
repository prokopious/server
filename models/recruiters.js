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
      required: false,
    },
    companyUrl: {
      type: String,
      required: false,
    },
    personalUrl: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
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