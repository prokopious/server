const mongoose = require("mongoose")
const Schema = mongoose.Schema

const jobSchema = new Schema(
  {
    company: {
      type: String,
      required: true,
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
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

var Jobs = mongoose.model('Job', jobSchema)

module.exports = Jobs
