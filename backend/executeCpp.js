// Importing required modules
const { exec } = require("child_process"); // Used to execute shell commands from Node.js
const fs = require("fs"); // File system module to interact with the file system
const path = require("path"); // Path module to handle file and directory paths

// Define the directory where compiled outputs will be stored
const outputPath = path.join(__dirname, "outputs"); // Combines the current directory with "outputs" to create an absolute path

// Example:
// If __dirname = "D:/Projects/OnlineCompiler/backend"
// Then outputPath = "D:/Projects/OnlineCompiler/backend/outputs"

// Check if the "outputs" directory exists, and if not, create it
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true }); // Ensures the entire directory path is created if it doesn't exist
}

// Example:
// If "outputs" directory does not exist, it will be created as:
// "D:/Projects/OnlineCompiler/backend/outputs"

// Function to execute a C++ file
// Takes the file path of the C++ source code as input
const executeCpp = (filepath) => {
  // Extract the job ID from the file name (assumes the file name is unique)
  const jobId = path.basename(filepath).split(".")[0]; // Gets the file name without its directory and removes the extension

  // Example:
  // If filepath = "D:/Projects/OnlineCompiler/backend/codes/test123.cpp"
  // Then jobId = "test123"

  const outPath = path.join(outputPath, `${jobId}.out`); // Creates the path for the compiled output file (e.g., "outputs/<jobId>.out")

  // Example:
  // If jobId = "test123" and outputPath = "D:/Projects/OnlineCompiler/backend/outputs"
  // Then outPath = "D:/Projects/OnlineCompiler/backend/outputs/test123.out"

  // Return a promise to handle asynchronous execution
  return new Promise((resolve, reject) => {
    // Command to compile the C++ file and execute the output
    // 1. `g++ <filepath> -o <outPath>`: Compiles the C++ file to an executable
    // 2. `cd <outputPath>`: Navigates to the directory where the executable is saved
    // 3. `./<jobId>.out`: Runs the compiled executable
    exec(
      `g++ "${filepath}" -o "${outPath}" && cd "${outputPath}" && ${jobId}.out`,

      (error, stdout, stderr) => {
        // If there's a compilation or runtime error, reject the promise with error details
        if (error) reject({ error, stderr });

        // If there are warnings or errors during execution, reject with the stderr message
        if (stderr) reject(stderr);

        // If successful, resolve the promise with the standard output
        resolve(stdout);
      }
    );
  });
};

// Example usage:
// Suppose filepath = "D:/Projects/OnlineCompiler/backend/codes/test123.cpp"
// The function will:
// 1. Compile "test123.cpp" into "D:/Projects/OnlineCompiler/backend/outputs/test123.out"
// 2. Navigate to "outputs" directory and execute "test123.out"
// If the program in "test123.cpp" prints "Hello, World!", the resolve function will return "Hello, World!"

// Export the `executeCpp` function for use in other modules
module.exports = {
  executeCpp,
};

// Example export usage in another file:
// const { executeCpp } = require('./executeCpp');
// executeCpp("D:/Projects/OnlineCompiler/backend/codes/test123.cpp")
//   .then(output => console.log(output)) // Logs the program output like "Hello, World!"
//   .catch(err => console.error(err));   // Logs any compilation or runtime errors
