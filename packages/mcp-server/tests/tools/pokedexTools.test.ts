import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as apiClient from '../../src/client/apiClient';
import { registerPokedexTools } from '../../src/tools/pokedexTools';
import { Pokemon } from '../../src/types/pokemon';
import { Area, AreaEncounter } from '../../src/types/area';

jest.mock('../../src/client/apiClient');

const mockApiGet = apiClient.apiGet as jest.MockedFunction<typeof apiClient.apiGet>;

function buildServer(): McpServer {
  const server = new McpServer({ name: 'test', version: '0.0.1' });
  registerPokedexTools(server);
  return server;
}

const samplePokemon: Pokemon = {
  id: 25,
  name: 'pikachu',
  types: ['electric'],
  moves: [{ id: 84, name: 'thunder-shock', type: 'electric' }],
};

const sampleArea: Area = { id: 1, name: 'viridian-forest' };
const sampleEncounters: AreaEncounter[] = [
  { pokemonId: 10, pokemonName: 'caterpie', encounterRate: 50 },
  { pokemonId: 13, pokemonName: 'weedle', encounterRate: 30 },
];

describe('lookup_pokemon tool', () => {
  it('returns formatted pokemon data by name', async () => {
    mockApiGet.mockResolvedValueOnce(samplePokemon);
    const server = buildServer();
    const result = await (server as any)._registeredTools['lookup_pokemon'].handler({ nameOrId: 'pikachu' });
    expect(result.content[0].text).toContain('pikachu');
    expect(result.content[0].text).toContain('#25');
    expect(result.content[0].text).toContain('electric');
  });

  it('returns formatted pokemon data by numeric id string', async () => {
    mockApiGet.mockResolvedValueOnce(samplePokemon);
    const server = buildServer();
    const result = await (server as any)._registeredTools['lookup_pokemon'].handler({ nameOrId: '25' });
    expect(result.content[0].text).toContain('pikachu');
  });

  it('returns error text on failure', async () => {
    mockApiGet.mockRejectedValueOnce(new Error('Pokemon not found'));
    const server = buildServer();
    const result = await (server as any)._registeredTools['lookup_pokemon'].handler({ nameOrId: 'unknown' });
    expect(result.content[0].text).toContain('Error:');
    expect(result.content[0].text).toContain('Pokemon not found');
  });
});

describe('lookup_area tool', () => {
  it('returns area name and encounter list', async () => {
    mockApiGet.mockResolvedValueOnce({ area: sampleArea, encounters: sampleEncounters });
    const server = buildServer();
    const result = await (server as any)._registeredTools['lookup_area'].handler({ areaId: 1 });
    expect(result.content[0].text).toContain('viridian-forest');
    expect(result.content[0].text).toContain('caterpie');
    expect(result.content[0].text).toContain('50%');
    expect(result.content[0].text).toContain('weedle');
  });

  it('returns no-encounters message for empty area', async () => {
    mockApiGet.mockResolvedValueOnce({ area: sampleArea, encounters: [] });
    const server = buildServer();
    const result = await (server as any)._registeredTools['lookup_area'].handler({ areaId: 1 });
    expect(result.content[0].text).toContain('No Pokemon encounters');
  });

  it('returns error text on failure', async () => {
    mockApiGet.mockRejectedValueOnce(new Error('Area not found'));
    const server = buildServer();
    const result = await (server as any)._registeredTools['lookup_area'].handler({ areaId: 999 });
    expect(result.content[0].text).toContain('Error:');
  });
});
