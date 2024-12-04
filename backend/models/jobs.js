// Importing the 'mongoose' library
// Mongoose is used for interacting with MongoDB and defining data schemas in Node.js.
const mongoose = require("mongoose");

// Defining a Schema for the 'Job' model
// A schema outlines the structure of documents (records) in a MongoDB collection.
const JobSchema = mongoose.Schema({
  // Field: 'language'
  // Type: String
  // Purpose: Stores the programming language (e.g., C++, Python) of the job.
  language: {
    type: String, // Data type of this field is a string.
    required: true, // This field is mandatory and must be provided.
    enum: ["cpp", "py"], // Restricts the value to either "cpp" (C++) or "py" (Python).
  },

  // Field: 'filepath'
  // Type: String
  // Purpose: Stores the file path of the source code to be executed.
  filepath: {
    type: String, // Data type is a string.
    required: true, // This field is also mandatory.
  },

  // Field: 'submittedAt'
  // Type: Date
  // Purpose: Stores the timestamp when the job was submitted.
  submittedAt: {
    type: Date, // Data type is a date.
    default: Date.now, // If no value is provided, it defaults to the current date and time.
  },

  // Field: 'startedAt'
  // Type: Date
  // Purpose: Stores the timestamp when the job started executing.
  startedAt: {
    type: Date, // Data type is a date.
    // Optional: This field is not required and may remain undefined if the job hasn't started yet.
  },

  // Field: 'completedAt'
  // Type: Date
  // Purpose: Stores the timestamp when the job finished executing.
  completedAt: {
    type: Date, // Data type is a date.
    // Optional: This field is not required and may remain undefined if the job hasn't finished yet.
  },

  // Field: 'status'
  // Type: String
  // Purpose: Tracks the current status of the job.
  status: {
    type: String, // Data type is a string.
    default: "pending", // Default status is "pending" (job not started yet).
    enum: ["pending", "success", "error"], // Possible values are:
    // - "pending": Job is waiting to be executed.
    // - "success": Job executed successfully.
    // - "error": Job encountered an error during execution.
  },

  // Field: 'output'
  // Type: String
  // Purpose: Stores the output generated by the executed job.
  output: {
    type: String, // Data type is a string.
    // Optional: This field may remain undefined if the job hasn't produced any output yet.
  },
});

// Exporting the 'Job' model
// Models are used to interact with the database collection corresponding to the schema.
// The collection name will be the lowercase plural form of "job" (e.g., "jobs").
module.exports = mongoose.model("job", JobSchema);
