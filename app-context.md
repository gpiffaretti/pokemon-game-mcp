# Pokemon Battle Application - Development Context

## Project Overview
A comprehensive Pokemon battle application where users can explore areas, find Pokemon, engage in battles, and build their Pokemon collection.

## Core Features

### Game Mechanics
- **Game Start**: Users choose a starter Pokemon (Bulbasaur, Charmander, Squirtle)
- **Party Management**: Track captured Pokemon (no duplicates allowed)
- **Area Navigation**: Move between different areas to find Pokemon
- **Pokemon Discovery**: Find random Pokemon in current area
- **Battle System**: Turn-based battles with move selection
- **Capture System**: 100% capture rate with Pokeballs
- **Game Completion**: Declare game finished

### User Actions
1. Start a new game
2. Query current party composition
3. Query current area location
4. Query pokedex for area information
5. Navigate to different areas
6. Find random Pokemon in current area
7. Start battles or run away
8. Choose battle moves
9. Throw Pokeballs to capture
10. Change the starting pokemon. This pokemon will be used when engaging in battles. Changing pokemon during battle is not allowed.
11. Get moves for the current pokemon
12. Declare game completion

## Technical Architecture

### Backend Stack
- **NodeJS/Express**: REST API server
- **PostgreSQL**: Game state persistence
- **TypeScript**: Type safety and development experience

### MCP Server
- **TypeScript MCP Server**: Provides additional functionality and integrations

### Database Design Considerations
- Game state persistence
- User progress tracking
- Pokemon data storage
- Area/Location mapping
- Battle history

## Game Rules & Constraints

### Battle System
- No HP tracking (simplified battle mechanics)
- Move-based combat 
- After the user selects a move, the opponent will also select a move. The result of this is a tuple with the user's move and the opponent's move.
- Choice to battle or flee in any turn

### Capture Mechanics
- 100% capture rate with Pokeballs
- No duplicate Pokemon in party
- Starter selection required

### Area System
- Multiple explorable areas
- Area-specific Pokemon spawn rates
- Navigation between areas

## Development Phases

### Phase 1: Core Infrastructure
- Database schema design
- Express API setup
- Basic game state management

### Phase 2: Pokemon System
- Pokemon data integration
- Pokedex functionality
- Area-Pokemon mapping

### Phase 3: Battle System
- Battle mechanics implementation
- Move system
- Capture mechanics

### Phase 4: User Interface
- API endpoint completion
- MCP server integration
- Testing and validation

## Key Components

### Database Tables (Planned)
- `games`: Game sessions with current state (id, current_state: SELECTING_STARTING_POKEMON/EXPLORING/BATTLING/FINISHED, current_area_id, created_at, updated_at)
- `captured_pokemon`: Player's captured Pokemon collection (game_id, pokemon_id, captured_at)
- `starting_pokemon`: Player's selected starting Pokemon (game_id, pokemon_id, selected_at)

### API Endpoints (Planned)
- Game management (start, status, finish)
- Captured Pokemon management (view, add Pokemon)
- Starting Pokemon management (set, change starting Pokemon)
- Area navigation (current, move, explore)
- Battle system (start, action, result)
- Pokedex queries (Pokemon info, areas) - fetched from PokeAPI

### MCP Server Functions
- **Primary User Interface**: Main interaction method for the game
- Enhanced game interactions with natural language responses
- External integrations with PokeAPI for real-time Pokemon data
- Advanced querying capabilities with LLM-powered responses
- Chat-based gameplay experience through user's preferred LLM

## Success Criteria
- Fully functional REST API
- Persistent game state
- Complete battle system
- Working capture mechanics
- **Stable MCP server as primary user interface**
- **Natural language chat-based gameplay experience**

## Next Steps
1. Set up project structure and dependencies
2. Design and implement database schema
3. Create Express API endpoints
4. Implement core game logic
5. Develop MCP server functionality
6. Testing and validation
