// Importing required modules
const express = require("express"); // Express is a web framework for creating server-side applications.
const cors = require("cors"); // CORS (Cross-Origin Resource Sharing) allows us to handle requests from different origins.
const mongoose = require("mongoose"); // Mongoose is a library for interacting with MongoDB databases.

// Connecting to MongoDB
mongoose.connect(
  "mongodb://localhost/compilerdb", // URL of the MongoDB database
  {
    useNewUrlParser: true, // Ensures parsing of the connection string in the new MongoDB driver.
    useUnifiedTopology: true, // Enables the new Server Discover and Monitoring engine.
  },
  (err) => {
    // Callback function to handle connection status
    err && console.error(err); // Log an error if the connection fails.
    console.log("Successfully connected to MongoDB: compilerdb"); // Confirmation message for successful connection.
  }
);

// Importing utility functions and models
const { generateFile } = require("./generateFile"); // Function to create a file for the code submission.
const { addJobToQueue } = require("./jobQueue"); // Function to add jobs to a processing queue.
const Job = require("./models/Job"); // Job schema for MongoDB.

// Creating an Express application
const app = express();

// Middleware configuration
app.use(cors()); // Allows handling requests from different origins.
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data in HTTP requests.
app.use(express.json()); // Parses JSON data in HTTP requests.

// POST endpoint to handle code execution requests
app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body; // Extracting the programming language (default: "cpp") and code from the request body.

  console.log(language, "Length:", code.length); // Logging the language and code length for debugging purposes.

  // Validating if code is provided
  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" }); // Respond with an error if code is missing.
  }

  // Step 1: Generate a file with the submitted code.
  const filepath = await generateFile(language, code);

  // Step 2: Save job details to the database.
  const job = await new Job({ language, filepath }).save();
  const jobId = job["_id"]; // Extract the job ID for reference.

  // Step 3: Add the job to the processing queue.
  addJobToQueue(jobId);

  // Step 4: Respond with the job ID.
  res.status(201).json({ jobId });
});

// GET endpoint to check the status of a job
app.get("/status", async (req, res) => {
  const jobId = req.query.id; // Extracting the job ID from query parameters.

  // Validating if the job ID is provided
  if (jobId === undefined) {
    return res
      .status(400)
      .json({ success: false, error: "missing id query param" }); // Respond with an error if job ID is missing.
  }

  // Step 1: Find the job details in the database.
  const job = await Job.findById(jobId);

  // Step 2: Validate if the job exists.
  if (job === undefined) {
    return res
      .status(400)
      .json({ success: false, error: "couldn't find job" }); // Respond with an error if job not found.
  }

  // Step 3: Return the job details if found.
  return res.status(200).json({ success: true, job });
});

// Start the server
app.listen(5000, () => {
  console.log(`Listening on port 5000!`); // Log a message indicating the server is running on port 5000.
});
