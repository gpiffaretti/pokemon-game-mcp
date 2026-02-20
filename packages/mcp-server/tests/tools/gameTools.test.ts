import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as apiClient from '../../src/client/apiClient';
import { registerGameTools } from '../../src/tools/gameTools';
import { Game } from '../../src/types/game';

jest.mock('../../src/client/apiClient');

const mockApiGet = apiClient.apiGet as jest.MockedFunction<typeof apiClient.apiGet>;
const mockApiPost = apiClient.apiPost as jest.MockedFunction<typeof apiClient.apiPost>;

function buildServer(): McpServer {
  const server = new McpServer({ name: 'test', version: '0.0.1' });
  registerGameTools(server);
  return server;
}

const sampleGame: Game = {
  id: 'game-1',
  state: 'EXPLORING',
  currentAreaId: 3,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('start_game tool', () => {
  it('returns formatted game on success', async () => {
    mockApiPost.mockResolvedValueOnce(sampleGame);
    const server = buildServer();
    const result = await (server as any)._registeredTools['start_game'].handler({});
    expect(result.content[0].text).toContain('New game started!');
    expect(result.content[0].text).toContain('game-1');
    expect(result.content[0].text).toContain('EXPLORING');
  });

  it('returns error text on failure', async () => {
    mockApiPost.mockRejectedValueOnce(new Error('Network error'));
    const server = buildServer();
    const result = await (server as any)._registeredTools['start_game'].handler({});
    expect(result.content[0].text).toContain('Error:');
    expect(result.content[0].text).toContain('Network error');
  });
});

describe('get_game_status tool', () => {
  it('returns formatted game state', async () => {
    mockApiGet.mockResolvedValueOnce(sampleGame);
    const server = buildServer();
    const result = await (server as any)._registeredTools['get_game_status'].handler({ gameId: 'game-1' });
    expect(result.content[0].text).toContain('game-1');
    expect(result.content[0].text).toContain('EXPLORING');
    expect(result.content[0].text).toContain('area=3');
  });

  it('returns error text on failure', async () => {
    mockApiGet.mockRejectedValueOnce(new Error('Not found'));
    const server = buildServer();
    const result = await (server as any)._registeredTools['get_game_status'].handler({ gameId: 'bad-id' });
    expect(result.content[0].text).toContain('Error:');
  });
});

describe('finish_game tool', () => {
  it('returns finished game confirmation', async () => {
    const finishedGame: Game = { ...sampleGame, state: 'FINISHED' };
    mockApiPost.mockResolvedValueOnce(finishedGame);
    const server = buildServer();
    const result = await (server as any)._registeredTools['finish_game'].handler({ gameId: 'game-1' });
    expect(result.content[0].text).toContain('Game finished!');
    expect(result.content[0].text).toContain('FINISHED');
  });

  it('returns error text on failure', async () => {
    mockApiPost.mockRejectedValueOnce(new Error('Already finished'));
    const server = buildServer();
    const result = await (server as any)._registeredTools['finish_game'].handler({ gameId: 'game-1' });
    expect(result.content[0].text).toContain('Error:');
  });
});
