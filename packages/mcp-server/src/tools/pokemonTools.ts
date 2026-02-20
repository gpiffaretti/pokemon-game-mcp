import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { apiGet, apiPut } from '../client/apiClient';
import { endpoints } from '../client/endpoints';
import { CapturedPokemon } from '../types/game';
import { Move, Pokemon } from '../types/pokemon';
import { formatCapturedPokemonList, formatMoveList, formatPokemon } from '../utils/formatters';
import { formatError } from '../utils/errors';

export function registerPokemonTools(server: McpServer): void {
  server.registerTool(
    'get_current_pokemon',
    {
      description: 'Get the current selected Pokemon for the player. This pokemon will be the one to engage in battles.',
      inputSchema: z.object({ gameId: z.string().describe('The game ID') }),
    },
    async ({ gameId }) => {
      try {
        const current: Pokemon | null = await apiGet<Pokemon | null>(endpoints.pokemon.current(gameId));
        if (!current) {
          return { content: [{ type: 'text' as const, text: 'No starting Pokemon selected.' }] };
        }
        return { content: [{ type: 'text' as const, text: formatPokemon(current) }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Error: ${formatError(err)}` }] };
      }
    },
  );

  server.registerTool(
    'list_starter_options',
    {
      description: 'List the available Pokemon options for the initial Pokemon selection. This is the most important decision in the game, wait for the player to explicitly choose one of these.',
    },
    async () => {
      try {
        const options = await apiGet<Pokemon[]>(endpoints.pokemon.starterOptions());
        const text = options.map((p) => formatPokemon(p)).join('\n');
        return { content: [{ type: 'text' as const, text: `Available starters:\n${text}` }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Error: ${formatError(err)}` }] };
      }
    },
  );

  server.registerTool(
    'list_captured_pokemon',
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
    'set_current_pokemon',
    {
      description: 'Set or change the current Pokemon used in battles. The Pokemon must be in the captured collection. During initial setup, choose from the available starter options.',
      inputSchema: z.object({
        gameId: z.string().describe('The game ID'),
        pokemonId: z.number().int().describe('The Pokemon ID to set as current'),
      }),
    },
    async ({ gameId, pokemonId }) => {
      try {
        const game = await apiPut<{ currentPokemonId: number }>(endpoints.pokemon.current(gameId), { pokemonId });
        return {
          content: [
            {
              type: 'text' as const,
              text: `Current Pokemon updated to #${game.currentPokemonId}.`,
            },
          ],
        };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Error: ${formatError(err)}` }] };
      }
    },
  );

  server.registerTool(
    'get_current_pokemon_moves',
    {
      description: 'Get the available moves for the current Pokemon chosen to engage in battles.',
      inputSchema: z.object({ gameId: z.string().describe('The game ID') }),
    },
    async ({ gameId }) => {
      try {
        const moves = await apiGet<Move[]>(endpoints.pokemon.currentMoves(gameId));
        return { content: [{ type: 'text' as const, text: formatMoveList(moves) }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Error: ${formatError(err)}` }] };
      }
    },
  );
}
