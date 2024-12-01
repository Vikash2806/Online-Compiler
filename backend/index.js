const express = require('express');
const app = express();

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded form data (e.g., from HTML forms)

app.use(express.json()); 

// Start server
app.listen(5000, () => {
    console.log('listening on port 5000');
});

// Routes
app.get("/", (req, res) => {
    return res.json({ hello: "world" });
});

app.post("/run", (req, res) => {	
    //  const language = req.body.language;
    //  const code = req.body.code;
     const {language = "cpp", code} = req.body;//here cpp is default!

     if(code === undefined){
        return res.status(404).json({Message:false , error: "Empty code requested"});
        }
     
    return res.json({language,code});
});
