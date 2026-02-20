import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as apiClient from '../../src/client/apiClient';
import { registerAreaTools } from '../../src/tools/areaTools';
import { Area } from '../../src/types/area';
import { Pokemon } from '../../src/types/pokemon';

jest.mock('../../src/client/apiClient');

const mockApiGet = apiClient.apiGet as jest.MockedFunction<typeof apiClient.apiGet>;
const mockApiPost = apiClient.apiPost as jest.MockedFunction<typeof apiClient.apiPost>;
const mockApiPut = apiClient.apiPut as jest.MockedFunction<typeof apiClient.apiPut>;

function buildServer(): McpServer {
  const server = new McpServer({ name: 'test', version: '0.0.1' });
  registerAreaTools(server);
  return server;
}

const sampleArea: Area = { id: 12, name: 'pallet-town-area' };
const samplePokemon: Pokemon = {
  id: 25,
  name: 'pikachu',
  types: ['electric'],
  moves: [{ id: 84, name: 'thunder-shock', type: 'electric' }],
};

describe('get_current_area tool', () => {
  it('returns formatted area', async () => {
    mockApiGet.mockResolvedValueOnce(sampleArea);
    const server = buildServer();
    const result = await (server as any)._registeredTools['get_current_area'].handler({ gameId: 'g1' });
    expect(result.content[0].text).toContain('Area #12');
    expect(result.content[0].text).toContain('pallet-town-area');
  });

  it('returns error text on failure', async () => {
    mockApiGet.mockRejectedValueOnce(new Error('No area set'));
    const server = buildServer();
    const result = await (server as any)._registeredTools['get_current_area'].handler({ gameId: 'g1' });
    expect(result.content[0].text).toContain('Error:');
  });
});

describe('move_to_area tool', () => {
  it('returns moved-to area message', async () => {
    mockApiPut.mockResolvedValueOnce(sampleArea);
    const server = buildServer();
    const result = await (server as any)._registeredTools['move_to_area'].handler({ gameId: 'g1', areaId: 12 });
    expect(result.content[0].text).toContain('Moved to');
    expect(result.content[0].text).toContain('pallet-town-area');
  });

  it('returns error text on failure', async () => {
    mockApiPut.mockRejectedValueOnce(new Error('Invalid area'));
    const server = buildServer();
    const result = await (server as any)._registeredTools['move_to_area'].handler({ gameId: 'g1', areaId: 999 });
    expect(result.content[0].text).toContain('Error:');
  });
});

describe('explore_area tool', () => {
  it('returns wild pokemon encounter message', async () => {
    mockApiPost.mockResolvedValueOnce(samplePokemon);
    const server = buildServer();
    const result = await (server as any)._registeredTools['explore_area'].handler({ gameId: 'g1' });
    expect(result.content[0].text).toContain('A wild Pokemon appeared!');
    expect(result.content[0].text).toContain('pikachu');
    expect(result.content[0].text).toContain('#25');
  });

  it('returns error text on failure', async () => {
    mockApiPost.mockRejectedValueOnce(new Error('Not in exploring state'));
    const server = buildServer();
    const result = await (server as any)._registeredTools['explore_area'].handler({ gameId: 'g1' });
    expect(result.content[0].text).toContain('Error:');
  });
});
