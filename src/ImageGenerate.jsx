import { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./ImageGenerator.css";
import CircularProgress from "@mui/material/CircularProgress"; 

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 


  const handleChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     const HF_TOKEN = import.meta.env.VITE_REACT_APP_HF_TOKEN;
     console.log(HF_TOKEN);
    console.log("Prompt submitted:", prompt);
    setImageData(null);
    setError(null);
    setLoading(true);

    try {
      const apiUrl =
        "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-dev";

      const requestBody = {
        inputs: prompt,
        response_format: "b64_json",
      };

      const headers = {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.post(apiUrl, requestBody, { headers });
      console.log("Raw API Response:", response.data);
      const base64Image = response.data;

      setImageData(`data:image/jpeg;base64,${base64Image}`);
    } catch (err) {
      console.error("API Error:", err);

      if (err.response) {
        console.error("Error Status:", err.response.status);
        console.error(
          "Error Data (IMPORTANT FOR 400 ERRORS):",
          err.response.data
        ); 
        console.error("Error Headers:", err.response.headers);
        setError(
          `Error ${err.response.status}: ${
            err.response.data.error ||
            err.response.data.detail ||
            JSON.stringify(err.response.data)
          }`
        );
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError(
          "No response from server. Please check your network connection."
        );
      } else {
        console.error("Error Message:", err.message);
        setError(`An unexpected error occurred: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
    <h1>Welcome to My project</h1>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-inter">
      
      <div className="SearchBox">
        <h1 className="header">
          Generate Image  by <span>using Huggingface API</span> 
        </h1>
        <form onSubmit={handleSubmit}>
          <TextField
            id="prompt-input"
            name="input"
            label="Enter your image prompt"
            variant="outlined"
            required
            value={prompt}
            onChange={handleChange}
             fullWidth
            multiline 
            rows={2}
          />

          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Generate Image"
            )}
          </Button>

          {error && (
            <p className="text-red-600 text-center mt-2 p-2 bg-red-100 border border-red-400 rounded-md">
              {error}
            </p>
          )}
        </form>

        {loading && (
          <div className="loading-container">
            <CircularProgress />
            <p>Generating your image...</p>
          </div>
        )}

        {imageData && (
          <div className="image-container">
            <img
              src={imageData}
              alt="Generated from prompt" style={{height:"370px",width:"600px"}}
              className="rounded-lg" 
            />
          </div>
        )}
      </div>
    </div>
    <i>make by @nikhil-kumar</i>
    </div>
  );
}
