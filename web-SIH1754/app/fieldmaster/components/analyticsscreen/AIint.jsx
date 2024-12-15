import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: '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', dangerouslyAllowBrowser: true });

function AIint() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [response2, setResponse2] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize Google Generative AI
  const genAI = new GoogleGenerativeAI("AIzaSyDk5D44rJ2p9aoCbjUTbs-7Od_lxzse8VY");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Gemini Content Generation
  const generateContent = async (prompt) => {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Error generating Gemini content:", error);
      return "Error generating Gemini response.";
    }
  };

  // Groq Content Generation
  const generateGroqContent = async (prompt) => {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
      });
      return chatCompletion.choices[0]?.message?.content || "No response from Groq";
    } catch (error) {
      console.error("Error generating Groq content:", error);
      return "Error generating Groq response.";
    }
  };

  // Handle Gemini Generation
  const handleGenerate = async () => {
    if (prompt.trim() === '') return;
    
    setLoading(true);
    try {
      const aiResponse = await generateContent(prompt);
      setResponse(aiResponse);
    } catch (error) {
      setResponse("Error generating response");
    } finally {
      setLoading(false);
    }
  };

  // Handle Groq Generation
  const handleGroq = async () => {
    if (prompt.trim() === '') return;
    
    setLoading(true);
    try {
      const aiResponse = await generateGroqContent(prompt);
      setResponse2(aiResponse);
    } catch (error) {
      setResponse2("Error generating Groq response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
        className="w-full p-2 border rounded"
      />
      <div className="flex space-x-2">
        <button 
          onClick={handleGenerate} 
          disabled={loading}
          className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate (Gemini)'}
        </button>
        <button 
          onClick={handleGroq} 
          disabled={loading}
          className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate (Groq)'}
        </button>
      </div>
      
      {response && (
        <div className="mt-4">
          <h3 className="font-bold">Gemini Response:</h3>
          <p className="bg-blue-50 p-2 rounded">{response}</p>
        </div>
      )}
      
      {response2 && (
        <div className="mt-4">
          <h3 className="font-bold">Groq Response:</h3>
          <p className="bg-green-50 p-2 rounded">{response2}</p>
        </div>
      )}
    </div>
  );
}

export default AIint;