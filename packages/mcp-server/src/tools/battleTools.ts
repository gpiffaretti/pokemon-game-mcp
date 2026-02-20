import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { apiPost } from '../client/apiClient';
import { endpoints } from '../client/endpoints';
import { MoveResult, BattleResult } from '../types/battle';
import { formatMoveResult, formatBattleResult } from '../utils/formatters';
import { formatError } from '../utils/errors';

export function registerBattleTools(server: McpServer): void {
  server.registerTool(
    'start_battle',
    {
      description: 'Initiate a battle with an encountered wild Pokemon.',
      inputSchema: z.object({
        gameId: z.string().describe('The game ID'),
        wildPokemonId: z.number().int().describe('The wild Pokemon ID to battle'),
      }),
    },
    async ({ gameId, wildPokemonId }) => {
      try {
        await apiPost(endpoints.battle.start(gameId), { wildPokemonId });
        return {
          content: [
            {
              type: 'text' as const,
              text: `Battle started against wild Pokemon #${wildPokemonId}! Choose a move or flee.`,
            },
          ],
        };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Error: ${formatError(err)}` }] };
      }
    },
  );

  server.registerTool(
    'perform_move',
    {
      description: 'Use a move in battle. Returns the player move and the opponent move.',
      inputSchema: z.object({
        gameId: z.string().describe('The game ID'),
        moveId: z.number().int().describe('The move ID to use'),
      }),
    },
    async ({ gameId, moveId }) => {
      try {
        const result = await apiPost<MoveResult>(endpoints.battle.move(gameId), { moveId });
        return { content: [{ type: 'text' as const, text: formatMoveResult(result) }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Error: ${formatError(err)}` }] };
      }
    },
  );

  server.registerTool(
    'flee_battle',
    {
      description: 'Run away from the current battle.',
      inputSchema: z.object({ gameId: z.string().describe('The game ID') }),
    },
    async ({ gameId }) => {
      try {
        const result = await apiPost<BattleResult>(endpoints.battle.flee(gameId));
        return { content: [{ type: 'text' as const, text: formatBattleResult(result) }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Error: ${formatError(err)}` }] };
      }
    },
  );

  server.registerTool(
    'throw_pokeball',
    {
      description: 'Attempt to capture the wild Pokemon (100% success rate).',
      inputSchema: z.object({ gameId: z.string().describe('The game ID') }),
    },
    async ({ gameId }) => {
      try {
        const result = await apiPost<BattleResult>(endpoints.battle.catch(gameId));
        return { content: [{ type: 'text' as const, text: formatBattleResult(result) }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Error: ${formatError(err)}` }] };
      }
    },
  );
}
