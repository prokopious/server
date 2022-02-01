const mongoose = require("mongoose")
const Schema = mongoose.Schema

const recruiterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    notes: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

var Recruiters = mongoose.model('Recruiter', recruiterSchema)

module.exports = Recruiters