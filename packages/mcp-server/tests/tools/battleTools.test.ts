import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as apiClient from '../../src/client/apiClient';
import { registerBattleTools } from '../../src/tools/battleTools';
import { MoveResult, BattleResult } from '../../src/types/battle';

jest.mock('../../src/client/apiClient');

const mockApiPost = apiClient.apiPost as jest.MockedFunction<typeof apiClient.apiPost>;

function buildServer(): McpServer {
  const server = new McpServer({ name: 'test', version: '0.0.1' });
  registerBattleTools(server);
  return server;
}

const sampleMove = { id: 10, name: 'tackle', type: 'normal' };
const sampleOpponentMove = { id: 45, name: 'growl', type: 'normal' };

describe('start_battle tool', () => {
  it('returns battle started message with pokemon id', async () => {
    mockApiPost.mockResolvedValueOnce({});
    const server = buildServer();
    const result = await (server as any)._registeredTools['start_battle'].handler({ gameId: 'g1', wildPokemonId: 25 });
    expect(result.content[0].text).toContain('Battle started');
    expect(result.content[0].text).toContain('25');
  });

  it('returns error text on failure', async () => {
    mockApiPost.mockRejectedValueOnce(new Error('Not in exploring state'));
    const server = buildServer();
    const result = await (server as any)._registeredTools['start_battle'].handler({ gameId: 'g1', wildPokemonId: 25 });
    expect(result.content[0].text).toContain('Error:');
    expect(result.content[0].text).toContain('Not in exploring state');
  });
});

describe('perform_move tool', () => {
  it('returns formatted move result', async () => {
    const moveResult: MoveResult = { playerMove: sampleMove, opponentMove: sampleOpponentMove };
    mockApiPost.mockResolvedValueOnce(moveResult);
    const server = buildServer();
    const result = await (server as any)._registeredTools['perform_move'].handler({ gameId: 'g1', moveId: 10 });
    expect(result.content[0].text).toContain('You used tackle!');
    expect(result.content[0].text).toContain('Opponent used growl.');
  });

  it('returns error text on failure', async () => {
    mockApiPost.mockRejectedValueOnce(new Error('Invalid move'));
    const server = buildServer();
    const result = await (server as any)._registeredTools['perform_move'].handler({ gameId: 'g1', moveId: 99 });
    expect(result.content[0].text).toContain('Error:');
  });
});

describe('flee_battle tool', () => {
  it('returns fled battle result', async () => {
    const battleResult: BattleResult = { playerMove: sampleMove, opponentMove: sampleOpponentMove, fled: true };
    mockApiPost.mockResolvedValueOnce(battleResult);
    const server = buildServer();
    const result = await (server as any)._registeredTools['flee_battle'].handler({ gameId: 'g1' });
    expect(result.content[0].text).toContain('You fled the battle!');
  });

  it('returns error text on failure', async () => {
    mockApiPost.mockRejectedValueOnce(new Error('Not in battle'));
    const server = buildServer();
    const result = await (server as any)._registeredTools['flee_battle'].handler({ gameId: 'g1' });
    expect(result.content[0].text).toContain('Error:');
  });
});

describe('throw_pokeball tool', () => {
  it('returns captured battle result', async () => {
    const battleResult: BattleResult = { playerMove: sampleMove, opponentMove: sampleOpponentMove, captured: true };
    mockApiPost.mockResolvedValueOnce(battleResult);
    const server = buildServer();
    const result = await (server as any)._registeredTools['throw_pokeball'].handler({ gameId: 'g1' });
    expect(result.content[0].text).toContain('You caught the wild Pokemon!');
  });

  it('returns error text on failure', async () => {
    mockApiPost.mockRejectedValueOnce(new Error('Not in battle'));
    const server = buildServer();
    const result = await (server as any)._registeredTools['throw_pokeball'].handler({ gameId: 'g1' });
    expect(result.content[0].text).toContain('Error:');
  });
});
