// Importing necessary libraries and components
// - `axios` is used for making HTTP requests.
// - `moment` helps in manipulating and formatting dates.
// - React components and hooks are imported for building the UI and managing states.
import axios from "axios"; // Example: axios.get(url).then(response => console.log(response));
import "./App.css"; // Importing CSS for styling
import stubs from "./stubs"; // Default code snippets for different languages
import React, { useState, useEffect } from "react"; // React library and hooks
import moment from "moment"; // Example: moment().format("YYYY-MM-DD");

// Main functional component of the application
function App() {
  // React state variables
  // - `code`: Holds the source code input by the user.
  // - `output`: Stores the output after code execution.
  // - `language`: Stores the currently selected programming language.
  // - `jobId`: Unique ID for the code execution job.
  // - `status`: Represents the status of the code execution (e.g., Submitted, Completed).
  // - `jobDetails`: Stores additional details about the execution job.
  const [code, setCode] = useState(""); // Example: useState("default value");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp"); // Default language: C++
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);

  // useEffect: Runs side effects like setting initial values or reacting to changes.
  // - This effect updates `code` whenever the `language` changes.
  useEffect(() => {
    setCode(stubs[language]); // Example: On language change, fetch default code.
  }, [language]); // Dependency array: Runs effect when `language` changes.

  // Another useEffect: Sets the default programming language on first load.
  useEffect(() => {
    const defaultLang = localStorage.getItem("default-language") || "cpp"; // Example: Get item from local storage
    setLanguage(defaultLang);
  }, []); // Empty array means this runs once when the component mounts.

  let pollInterval; // To store interval ID for polling

  // Function to handle code submission
  const handleSubmit = async () => {
    // Payload contains the current language and code
    const payload = {
      language, // Example: { language: "cpp" }
      code, // Example: { code: "int main() { return 0; }" }
    };
    try {
      // Resetting states before submission
      setOutput(""); // Clear previous output
      setStatus(null);
      setJobId(null);
      setJobDetails(null);

      // Making POST request to submit the code
      const { data } = await axios.post("http://localhost:5000/run", payload);

      if (data.jobId) {
        // If submission is successful, set jobId and status
        setJobId(data.jobId);
        setStatus("Submitted.");

        // Polling the status of the submitted job every second
        pollInterval = setInterval(async () => {
          const { data: statusRes } = await axios.get(
            `http://localhost:5000/status`,
            {
              params: { id: data.jobId }, // Sending jobId as a query parameter
            }
          );

          const { success, job, error } = statusRes;
          if (success) {
            // Update status and output if successful
            const { status: jobStatus, output: jobOutput } = job;
            setStatus(jobStatus);
            setJobDetails(job);
            if (jobStatus === "pending") return; // Keep polling if status is "pending"
            setOutput(jobOutput); // Set the output
            clearInterval(pollInterval); // Stop polling
          } else {
            // Handle errors
            setOutput(error);
            setStatus("Bad request");
            clearInterval(pollInterval); // Stop polling
          }
        }, 1000); // Poll every 1 second
      } else {
        setOutput("Retry again."); // If no jobId, retry
      }
    } catch ({ response }) {
      // Catching errors and setting output
      if (response) {
        const errMsg = response.data.err.stderr;
        setOutput(errMsg); // Display error message
      } else {
        setOutput("Please retry submitting."); // General error message
      }
    }
  };

  // Function to set the default programming language
  const setDefaultLanguage = () => {
    localStorage.setItem("default-language", language); // Example: Set item in local storage
    console.log(`${language} set as default!`);
  };

  // Function to render time details of the job
  const renderTimeDetails = () => {
    if (!jobDetails) return ""; // If no job details, return empty string

    // Extract and format timestamps
    let { submittedAt, startedAt, completedAt } = jobDetails;
    let result = "";
    submittedAt = moment(submittedAt).toString(); // Format submission time
    result += `Job Submitted At: ${submittedAt}  `;

    // Calculate execution time if available
    if (!startedAt || !completedAt) return result;
    const start = moment(startedAt);
    const end = moment(completedAt);
    const diff = end.diff(start, "seconds", true); // Difference in seconds
    result += `Execution Time: ${diff}s`;
    return result;
  };

  // Main component rendering
  return (
    <div className="App">
      <h1>Online Code Compiler</h1>

      {/* Language selection dropdown */}
      <div>
        <label>Language:</label>
        <select
          value={language} // Current language
          onChange={(e) => {
            const shouldSwitch = window.confirm(
              "Are you sure you want to change language? WARNING: Your current code will be lost."
            );
            if (shouldSwitch) {
              setLanguage(e.target.value); // Change language
            }
          }}
        >
          <option value="cpp">C++</option> {/* Dropdown option */}
          <option value="py">Python</option>
        </select>
      </div>
      <br />

      {/* Button to set the default language */}
      <div>
        <button onClick={setDefaultLanguage}>Set Default</button>
      </div>
      <br />

      {/* Textarea for writing code */}
      <textarea
        rows="20"
        cols="75"
        value={code} // Current code
        onChange={(e) => setCode(e.target.value)} // Update code on change
      ></textarea>
      <br />

      {/* Button to submit code */}
      <button onClick={handleSubmit}>Submit</button>

      {/* Status and output display */}
      <p>{status}</p>
      <p>{jobId ? `Job ID: ${jobId}` : ""}</p>
      <p>{renderTimeDetails()}</p>
      <p>{output}</p>
    </div>
  );
}

// Exporting the component to be used in the application
export default App;
