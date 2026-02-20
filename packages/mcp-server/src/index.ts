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
