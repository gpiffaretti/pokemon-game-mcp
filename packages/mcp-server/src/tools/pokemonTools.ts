import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { apiGet, apiPut } from '../client/apiClient';
import { endpoints } from '../client/endpoints';
import { CapturedPokemon, StartingPokemon } from '../types/game';
import { Move } from '../types/pokemon';
import { formatCapturedPokemonList, formatMoveList } from '../utils/formatters';
import { formatError } from '../utils/errors';

export function registerPokemonTools(server: McpServer): void {
  server.registerTool(
    'get_captured_pokemon',
    {
      description: 'List all Pokemon captured in the current game.',
      inputSchema: z.object({ gameId: z.string().describe('The game ID') }),
    },
    async ({ gameId }) => {
      try {
        const list = await apiGet<CapturedPokemon[]>(endpoints.pokemon.captured(gameId));
        return { content: [{ type: 'text' as const, text: formatCapturedPokemonList(list) }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Error: ${formatError(err)}` }] };
      }
    },
  );

  server.registerTool(
    'get_starting_pokemon',
    {
      description: 'Get the current starting Pokemon for a game.',
      inputSchema: z.object({ gameId: z.string().describe('The game ID') }),
    },
    async ({ gameId }) => {
      try {
        const starting = await apiGet<StartingPokemon>(endpoints.pokemon.starting(gameId));
        return {
          content: [
            {
              type: 'text' as const,
              text: `Starting Pokemon: #${starting.pokemonId} (selected at ${starting.selectedAt})`,
            },
          ],
        };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Error: ${formatError(err)}` }] };
      }
    },
  );

  server.registerTool(
    'set_starting_pokemon',
    {
      description: 'Set or change the starting Pokemon used in battles.',
      inputSchema: z.object({
        gameId: z.string().describe('The game ID'),
        pokemonId: z.number().int().describe('The Pokemon ID to set as starter'),
      }),
    },
    async ({ gameId, pokemonId }) => {
      try {
        const starting = await apiPut<StartingPokemon>(endpoints.pokemon.starting(gameId), { pokemonId });
        return {
          content: [
            {
              type: 'text' as const,
              text: `Starting Pokemon updated to #${starting.pokemonId}.`,
            },
          ],
        };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Error: ${formatError(err)}` }] };
      }
    },
  );

  server.registerTool(
    'get_starting_pokemon_moves',
    {
      description: 'Get the available moves for the current starting Pokemon.',
      inputSchema: z.object({ gameId: z.string().describe('The game ID') }),
    },
    async ({ gameId }) => {
      try {
        const moves = await apiGet<Move[]>(endpoints.pokemon.startingMoves(gameId));
        return { content: [{ type: 'text' as const, text: formatMoveList(moves) }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Error: ${formatError(err)}` }] };
      }
    },
  );
}
