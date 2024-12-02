const { v4: uuid } = require("uuid");
const fs = require('fs');
const path = require('path');
const {v4}= require('uuid');

const dirCodes = path.join(__dirname,"codes");// Creates a path like "/backend/codes"

// Check if the "codes" directory exists
if(!fs.existsSync(dirCodes))
{   // If not, create the directory
    fs.mkdirSync(dirCodes,{recursive:true});// `recursive:true` ensures that any missing parent directories are also created
}
// Function to generate a new file

const generateFile = async (format,content)=>{
    /**
     * Parameters:
     * - format: The file format, e.g., 'js', 'py', 'cpp'.
     * - code: The actual source code content to be written into the file.
     */
    const jobId = uuid(); // Generate a unique ID for this file (e.g., '123e4567-e89b-12d3-a456-426614174000')
    const filename = `${jobId}.${format}`;// Create a filename combining the unique ID and file extension (e.g., '123e4567-e89b-12d3-a456-426614174000.js')
    const filepath = path.join(dirCodes,filename);// Complete path to the file (e.g., '/project-directory/codes/123e4567-e89b-12d3-a456-426614174000.js')
    // Write the code content to the file
    await fs.promises.writeFile(filepath, content);// Use fs.promises for async/await functionality
    return filepath;
};

module.exports = {
    generateFile,
  };
