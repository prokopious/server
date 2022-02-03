const mongoose = require("mongoose")
const Schema = mongoose.Schema

const jobSchema = new Schema(
  {
    company: {
      type: String,
      required: true,
      unique: true,
    },
    companyUrl: {
      type: String,
      required: false,
    },
    jobUrl: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

var Jobs = mongoose.model('Job', jobSchema)

module.exports = Jobs
