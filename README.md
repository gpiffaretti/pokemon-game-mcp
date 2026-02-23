# Pokemon Battle Application

A comprehensive Pokemon battle application where users can explore areas, find Pokemon, engage in battles, and build their Pokemon collection through both a REST API and an MCP (Model Context Protocol) server interface.

## 🎮 Features

### Core Game Mechanics
- **Game Start**: Choose your starter Pokemon (Bulbasaur, Charmander, Squirtle)
- **Party Management**: Build and manage your captured Pokemon collection (no duplicates allowed)
- **Area Navigation**: Explore different areas to discover wild Pokemon
- **Pokemon Discovery**: Find random Pokemon in your current area
- **Battle System**: Engage in turn-based battles with strategic move selection
- **Capture System**: Capture wild Pokemon with 100% success rate using Pokeballs
- **Game Progression**: Complete your journey and declare game completion

### User Actions
1. Start a new game session
2. Query your current Pokemon party
3. Check your current area location
5. Navigate between different areas
6. Find and encounter wild Pokemon
7. Initiate battles or choose to flee
8. Select battle moves during combat
9. Capture Pokemon with Pokeballs
10. Change your active Pokemon for battles
11. View available moves for your current Pokemon
12. Finish your adventure

## 🏗️ Architecture

### Backend Stack
- **Node.js/Express**: REST API server for game operations
- **PostgreSQL**: Persistent game state and user data storage
- **TypeScript**: Type-safe development experience
- **Drizzle ORM**: Modern database toolkit with SQL migrations

### MCP Server
- **TypeScript MCP Server**: Enhanced user interface with natural language interactions
- **PokeAPI Integration**: Real-time Pokemon data and information
- **LLM-Powered Gameplay**: Chat-based gaming experience through your preferred AI assistant

### Database Design
- `games`: Game sessions with state tracking
- `captured_pokemon`: Player's Pokemon collection

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed on your system
- Git for cloning the repository

### Running Locally with Docker Compose

Build the MCP server first:

```bash
cd packages/mcp-server
npm run build
```

Add the MCP config in Claude or preferred LLM client. Claude config:
```
"pokemon-mcp": {
   "command": "node",
   "args": ["c:\\<repo-location>\\packages\\mcp-server\\dist\\index.js"],
   "env": {
      "BACKEND_URL": "http://localhost:3000/api/v1"
   }
}
```

An .env file is already included for simplicity.
Just run `docker-compose up`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🔗 Related Resources

- [PokeAPI](https://pokeapi.co/) - External Pokemon data source
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP documentation
