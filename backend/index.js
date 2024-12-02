// Import required modules
const express = require("express"); // Framework to build web server
const { generateFile } = require("./generateFile"); // Function to generate code file
const { executeCpp } = require("./executeCpp"); // Function to compile and run C++ code

// Initialize an Express app
const app = express();

// Middleware to parse incoming requests with JSON payload
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data
app.use(express.json()); // Parses JSON data in requests

// Start server on port 5000
app.listen(5000, () => {
  console.log("listening on port 5000");
});

// Routes

// Root route to check server status
app.get("/", (req, res) => {
  return res.json({ hello: "world" });
});

// Route to handle code execution
app.post("/run", async (req, res) => {
  try {
    // Extract language and code from the request body
    // Default language is "cpp" (C++), but can be changed if needed
    const { language = "cpp", code } = req.body;

    // If no code is provided, return a 404 response
    if (code === undefined || code.trim() === "") {
      return res
        .status(400) // Bad Request
        .json({ message: false, error: "Empty code requested" });
    }

    // Step 1: Generate a file with the provided code
    const filepath = await generateFile(language, code);

    // Step 2: Compile and execute the generated file
    const output = await executeCpp(filepath);

    // Return the file path and output of the program
    return res.json({ filepath, output });
  } catch (error) {
    // Catch any error during file generation or code execution
    console.error("Error occurred:", error);

    // Send an appropriate error response
    return res.status(500).json({
      message: false,
      error: error.message || "Internal Server Error",
    });
  }
});
