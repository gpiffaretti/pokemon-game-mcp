import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as apiClient from '../../src/client/apiClient';
import { registerPokemonTools } from '../../src/tools/pokemonTools';
import { CapturedPokemon, StartingPokemon } from '../../src/types/game';
import { Move } from '../../src/types/pokemon';

jest.mock('../../src/client/apiClient');

const mockApiGet = apiClient.apiGet as jest.MockedFunction<typeof apiClient.apiGet>;
const mockApiPut = apiClient.apiPut as jest.MockedFunction<typeof apiClient.apiPut>;

function buildServer(): McpServer {
  const server = new McpServer({ name: 'test', version: '0.0.1' });
  registerPokemonTools(server);
  return server;
}

describe('get_captured_pokemon tool', () => {
  it('returns no-pokemon message when list is empty', async () => {
    mockApiGet.mockResolvedValueOnce([]);
    const server = buildServer();
    const result = await (server as any)._registeredTools['get_captured_pokemon'].handler({ gameId: 'g1' });
    expect(result.content[0].text).toBe('No Pokemon captured yet.');
  });

  it('returns numbered list of captured pokemon', async () => {
    const list: CapturedPokemon[] = [
      { gameId: 'g1', pokemonId: 25, capturedAt: '2024-01-01T00:00:00Z' },
      { gameId: 'g1', pokemonId: 1, capturedAt: '2024-01-02T00:00:00Z' },
    ];
    mockApiGet.mockResolvedValueOnce(list);
    const server = buildServer();
    const result = await (server as any)._registeredTools['get_captured_pokemon'].handler({ gameId: 'g1' });
    expect(result.content[0].text).toContain('1. Pokemon #25');
    expect(result.content[0].text).toContain('2. Pokemon #1');
  });

  it('returns error text on failure', async () => {
    mockApiGet.mockRejectedValueOnce(new Error('Game not found'));
    const server = buildServer();
    const result = await (server as any)._registeredTools['get_captured_pokemon'].handler({ gameId: 'bad' });
    expect(result.content[0].text).toContain('Error:');
  });
});

describe('get_starting_pokemon tool', () => {
  it('returns starting pokemon id and selection time', async () => {
    const starting: StartingPokemon = { gameId: 'g1', pokemonId: 4, selectedAt: '2024-01-01T00:00:00Z' };
    mockApiGet.mockResolvedValueOnce(starting);
    const server = buildServer();
    const result = await (server as any)._registeredTools['get_starting_pokemon'].handler({ gameId: 'g1' });
    expect(result.content[0].text).toContain('#4');
    expect(result.content[0].text).toContain('2024-01-01T00:00:00Z');
  });

  it('returns error text on failure', async () => {
    mockApiGet.mockRejectedValueOnce(new Error('No starting pokemon'));
    const server = buildServer();
    const result = await (server as any)._registeredTools['get_starting_pokemon'].handler({ gameId: 'g1' });
    expect(result.content[0].text).toContain('Error:');
  });
});

describe('set_starting_pokemon tool', () => {
  it('returns updated starting pokemon id', async () => {
    const starting: StartingPokemon = { gameId: 'g1', pokemonId: 7, selectedAt: '2024-01-01T00:00:00Z' };
    mockApiPut.mockResolvedValueOnce(starting);
    const server = buildServer();
    const result = await (server as any)._registeredTools['set_starting_pokemon'].handler({ gameId: 'g1', pokemonId: 7 });
    expect(result.content[0].text).toContain('#7');
  });

  it('returns error text on failure', async () => {
    mockApiPut.mockRejectedValueOnce(new Error('Pokemon not captured'));
    const server = buildServer();
    const result = await (server as any)._registeredTools['set_starting_pokemon'].handler({ gameId: 'g1', pokemonId: 99 });
    expect(result.content[0].text).toContain('Error:');
  });
});

describe('get_starting_pokemon_moves tool', () => {
  it('returns formatted move list', async () => {
    const moves: Move[] = [
      { id: 10, name: 'tackle', type: 'normal' },
      { id: 45, name: 'growl', type: 'normal' },
    ];
    mockApiGet.mockResolvedValueOnce(moves);
    const server = buildServer();
    const result = await (server as any)._registeredTools['get_starting_pokemon_moves'].handler({ gameId: 'g1' });
    expect(result.content[0].text).toContain('tackle');
    expect(result.content[0].text).toContain('growl');
  });

  it('returns no-moves message when list is empty', async () => {
    mockApiGet.mockResolvedValueOnce([]);
    const server = buildServer();
    const result = await (server as any)._registeredTools['get_starting_pokemon_moves'].handler({ gameId: 'g1' });
    expect(result.content[0].text).toBe('No moves available.');
  });

  it('returns error text on failure', async () => {
    mockApiGet.mockRejectedValueOnce(new Error('No starting pokemon'));
    const server = buildServer();
    const result = await (server as any)._registeredTools['get_starting_pokemon_moves'].handler({ gameId: 'g1' });
    expect(result.content[0].text).toContain('Error:');
  });
});
