/**
 * Simple CORS Proxy Server for Steam API
 * Run with: node proxy-server.js
 */

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());

// Proxy endpoint for Steam API - use regex to capture everything
app.get(/^\/api\/steam\/(.*)/, async (req, res) => {
  try {
    // Get the captured path from the regex
    const steamPath = req.params[0];
    const queryString = Object.keys(req.query).length > 0 
      ? '?' + new URLSearchParams(req.query).toString() 
      : '';
    const steamUrl = `https://api.steampowered.com/${steamPath}${queryString}`;
    
    console.log('Proxying Steam API request to:', steamUrl);
    console.log('Original request path:', req.path);
    
    const response = await fetch(steamUrl);
    
    if (!response.ok) {
      console.error('Steam API error:', response.status, response.statusText);
      return res.status(response.status).json({ error: `Steam API error: ${response.statusText}` });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Proxy request failed', details: error.message });
  }
});

// Proxy endpoint for Steam Store API - use regex to capture everything
app.get(/^\/api\/steamstore\/(.*)/, async (req, res) => {
  try {
    // Get the captured path from the regex
    const steamPath = req.params[0];
    const queryString = Object.keys(req.query).length > 0 
      ? '?' + new URLSearchParams(req.query).toString() 
      : '';
    const steamUrl = `https://store.steampowered.com/${steamPath}${queryString}`;
    
    console.log('Proxying Steam Store request to:', steamUrl);
    console.log('Original request path:', req.path);
    
    const response = await fetch(steamUrl);
    
    if (!response.ok) {
      console.error('Steam Store API error:', response.status, response.statusText);
      return res.status(response.status).json({ error: `Steam Store API error: ${response.statusText}` });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Proxy request failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`CORS Proxy server running on http://localhost:${PORT}`);
  console.log('Steam API: http://localhost:3001/api/steam/...');
  console.log('Steam Store: http://localhost:3001/api/steamstore/...');
});
