const { randomUUID } = require('crypto');
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

const generateFile = async (format,code)=>{
    /**
     * Parameters:
     * - format: The file format, e.g., 'js', 'py', 'cpp'.
     * - code: The actual source code content to be written into the file.
     */
    const jobId = uuid();
    const filename = `${jobId}.${jobId}`;
    const filepath = path.join(dirCodes,filename);
    await fs.writeFile(filepath,content);
    return filepath;
};

module.exports = generateFile;
