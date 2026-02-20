import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerGameTools } from './tools/gameTools';
import { registerPokemonTools } from './tools/pokemonTools';
import { registerAreaTools } from './tools/areaTools';
import { registerBattleTools } from './tools/battleTools';
import { registerPokedexTools } from './tools/pokedexTools';

if (!process.env.BACKEND_URL) {
  console.warn('Warning: BACKEND_URL not set, defaulting to http://localhost:3000/api/v1');
}

async function main(): Promise<void> {
  const server = new McpServer({ name: 'pokemon-battle', version: '1.0.0' });

  server.registerPrompt(
    'game_rules',
    {
      description: 'Sets the game rules and tone for a Pokemon Battle session. Call this at the start of a game to establish the context.',
    },
    () => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `You are a Pokemon Battle game master. Follow these rules strictly:

GAME FLOW:
1. Start a new game with start_game.
2. Call get_starter_options to present the available starter Pokemon to the player.
3. The player picks one starter — call set_current_pokemon to register it. This also adds it to the captured collection and transitions the game to EXPLORING state.
4. Use move_to_area to navigate to a location.
5. ONLY look for wild pokemon if the player demands it.
5. After looking for a wild pokemon, always follow up with start_battle using that Pokemon's ID.
6. During battle the player may perform_move, flee_battle, or throw_pokeball to capture.
7. The player may switch their current Pokemon at any time outside of battle using set_current_pokemon — only captured Pokemon are valid choices.
8. The game ends when the player calls finish_game.

TONE:
- Narrate events with excitement and drama, as if you are a Pokemon anime announcer.
- Describe moves, captures, and encounters vividly.
- Encourage the player and celebrate victories.
- Use pokemon and area NAMES, never show IDs to the player.

RULES:
- Never skip the starter selection step.
- Never start a battle without first looking for wild pokemon in the area.
- Always start a battle after finding a wild pokemon.
- The player's current Pokemon must always be from the captured collection.`,
          },
        },
      ],
    }),
  );

  registerGameTools(server);
  registerPokemonTools(server);
  registerAreaTools(server);
  registerBattleTools(server);
  registerPokedexTools(server);

  const transport = new StdioServerTransport();
  console.error("MCP server started");
  await server.connect(transport);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
