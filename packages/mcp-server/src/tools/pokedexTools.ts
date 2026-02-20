import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { apiGet } from '../client/apiClient';
import { endpoints } from '../client/endpoints';
import { Pokemon } from '../types/pokemon';
import { Area, AreaEncounter } from '../types/area';
import { formatPokemon, formatAreaEncounters } from '../utils/formatters';
import { formatError } from '../utils/errors';

interface AreaWithEncounters {
  area: Area;
  encounters: AreaEncounter[];
}

export function registerPokedexTools(server: McpServer): void {
  server.registerTool(
    'lookup_pokemon',
    {
      description: "Look up a Pokemon's data from the Pokedex by name or numeric ID (as string).",
      inputSchema: z.object({
        nameOrId: z.string().describe('Pokemon name (e.g. "pikachu") or numeric ID as string (e.g. "25")'),
      }),
    },
    async ({ nameOrId }) => {
      try {
        const pokemon = await apiGet<Pokemon>(endpoints.pokedex.pokemon(nameOrId));
        return { content: [{ type: 'text' as const, text: formatPokemon(pokemon) }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Error: ${formatError(err)}` }] };
      }
    },
  );

  server.registerTool(
    'lookup_area',
    {
      description: 'Get area info and its Pokemon encounter list from the Pokedex.',
      inputSchema: z.object({ areaId: z.number().int().describe('The area ID to look up') }),
    },
    async ({ areaId }) => {
      try {
        const data = await apiGet<AreaWithEncounters>(endpoints.pokedex.area(areaId));
        return {
          content: [
            {
              type: 'text' as const,
              text: formatAreaEncounters(data.area, data.encounters),
            },
          ],
        };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Error: ${formatError(err)}` }] };
      }
    },
  );
}
