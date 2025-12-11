# M7-TarefaFinal - Steam Games Browser

A modern React application for browsing Steam games with advanced search, filtering, and sorting capabilities. 

## 📋 Project Overview

This is a Single Page Application (SPA) built with React 19, TypeScript, and Vite that integrates with the Steam Web API to provide a comprehensive game browsing experience. The application features real-time search, filtering by genre and platform, persistent favorites, and responsive design.

## 🚀 API Integration

### API Used
**Steam Web API**
- Official Documentation: [https://steamcommunity.com/dev](https://steamcommunity.com/dev)
- Steam Store API Documentation: [https://wiki.teamfortress.com/wiki/User:RJackson/StorefrontAPI](https://wiki.teamfortress.com/wiki/User:RJackson/StorefrontAPI)

### Endpoints Used

1. **GetAppList** - `GET /ISteamApps/GetAppList/v2/`
   - Retrieves the complete list of Steam applications
   - Returns: `appid`, `name`

2. **AppDetails** - `GET /api/appdetails`
   - Fetches detailed information about specific games
   - Returns: `name`, `steam_appid`, `type`, `short_description`, `header_image`, `is_free`, `price_overview`, `platforms`, `genres`, `developers`, `publishers`, `release_date`, `metacritic`

3. **GetNumberOfCurrentPlayers** - `GET /ISteamUserStats/GetNumberOfCurrentPlayers/v1/`
   - Gets the current player count for a game
   - Returns: `player_count`, `result`

### JSON Fields Extracted

The application extracts and displays the following fields from the Steam API responses: 

- **Basic Information**: `appid`, `name`, `type`
- **Descriptions**: `short_description`, `detailed_description`
- **Media**: `header_image`
- **Pricing**: `is_free`, `price_overview` (currency, initial, final, discount_percent)
- **Platform Support**: `platforms` (windows, mac, linux)
- **Metadata**: `genres`, `categories`, `developers`, `publishers`, `release_date`
- **Ratings**: `metacritic` (score, url)
- **Statistics**: `player_count` (current players)

## 🏗️ Project Structure

```
M7-TarefaFinal/
├── src/
│   ├── components/       # React components
│   │   ├── features/     # Feature-specific components
│   │   └── ui/           # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service layer
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── constants/        # Application constants
│   ├── assets/           # Static assets
│   ├── App.tsx           # Main application component
│   ├── App.css           # Application styles
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── public/               # Public static files
├── proxy-server.js       # CORS proxy server
├── package. json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── README.md             # Project documentation
```

## 🔧 Prerequisites

Before running this project, you need to have Node.js installed on your system. 

**Download Node.js**:  [https://nodejs.org/en/download](https://nodejs.org/en/download)

- Recommended version: Node.js 18.x or higher
- This will include npm (Node Package Manager)

## 🚀 Running the Project in Development Mode

1. **Download the project** (if not already cloned):
   ```bash
   git clone https://github.com/m-serafim/M7-TarefaFinal. git
   cd M7-TarefaFinal
   ```

2. **Install dependencies**: 
   ```bash
   npm install
   ```

3. **Start the application**:
   ```bash
   npm start
   ```

   This command will:
   - Start the CORS proxy server on `http://localhost:3001`
   - Start the Vite development server with HMR on `http://localhost:5173`

4. **Open your browser** and navigate to: 
   ```
   http://localhost:5173
   ```

### Alternative Commands

- **Run only the development server** (without proxy):
  ```bash
  npm run dev
  ```

- **Run only the proxy server**:
  ```bash
  npm run proxy
  ```

- **Build for production**:
  ```bash
  npm run build
  ```

- **Preview production build**:
  ```bash
  npm run preview
  ```

- **Run linter**:
  ```bash
  npm run lint
  ```

## 🔌 Proxy Configuration

### Why a Proxy?

The Steam API does not support CORS (Cross-Origin Resource Sharing) for browser requests. To bypass this limitation during development, the project includes a Node.js proxy server (`proxy-server.js`) that forwards requests to the Steam API.

### Proxy Endpoints

- **Steam API**: `http://localhost:3001/api/steam/*` → `https://api.steampowered.com/*`
- **Steam Store API**: `http://localhost:3001/api/steamstore/*` → `https://store.steampowered.com/*`

### How It Works

1. The React application makes requests to `http://localhost:3001/api/steam/...`
2. The proxy server forwards these requests to `https://api.steampowered.com/...`
3. The proxy adds CORS headers to the response
4. The React application receives the data without CORS issues

## 💾 Data Persistence

### Storage Location
**localStorage** (Browser's Web Storage API)

### Persisted Data

The application persists the following user data in the browser's localStorage:

1. **Favorites** (`steam_favorites`)
   - List of favorite game IDs (appids)
   - Survives browser refreshes
   - Stored as JSON array

2. **Last Search Query** (`steam_last_search`)
   - User's most recent search term
   - Restored on page reload

3. **Last Filters** (`steam_last_filters`)
   - Selected genre, platform, and free-to-play filters
   - Maintained across sessions

4. **Last Sort Options** (`steam_last_sort`)
   - Sort field and order preferences
   - Applied automatically on reload

### Testing Persistence

To verify data persistence:

1. **Add favorites**:  Click the heart icon on any game
2. **Apply filters**: Select genre, platform, or free games filter
3. **Search**: Enter a search term
4. **Refresh the page**: Press F5 or Ctrl+R (Cmd+R on Mac)
5. **Verify**:  Your favorites, filters, and search should be preserved

To clear persisted data:
- Open Browser DevTools (F12)
- Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
- Navigate to **Local Storage** → `http://localhost:5173`
- Delete individual items or clear all

## 🛠️ Technology Stack

- **React**:  19.2.0
- **TypeScript**:  ~5.9.3
- **Vite**: 7.2.4
- **Node.js**: Express server for CORS proxy
- **CSS**: Modern CSS with custom properties

## 📝 Commit History

This repository maintains a clean and descriptive commit history with frequent commits documenting the development process.  You can view the complete history on GitHub: 

[View Commit History](https://github.com/m-serafim/M7-TarefaFinal/commits/main)

## 📚 Additional Documentation

- **API_CONTRACT.md**: Detailed API endpoint documentation and response schemas
- **IMPLEMENTATION_SUMMARY.md**: Technical implementation details
- **CONTRIBUTING.md**: Guidelines for contributing to the project

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on the code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed for educational purposes as part of the M7 course assignment. 

## 👤 Author

**m-serafim**
- GitHub: [@m-serafim](https://github.com/m-serafim)

---

**Last Updated**: December 2025
