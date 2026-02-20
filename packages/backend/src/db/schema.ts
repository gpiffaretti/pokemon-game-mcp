import { pgTable, uuid, varchar, integer, timestamp, primaryKey } from 'drizzle-orm/pg-core';

export const games = pgTable('games', {
  id: uuid('id').primaryKey().defaultRandom(),
  state: varchar('state', { length: 40 }).notNull().default('SELECTING_STARTING_POKEMON'),
  currentAreaId: integer('current_area_id'),
  wildPokemonId: integer('wild_pokemon_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const capturedPokemon = pgTable('captured_pokemon', {
  gameId: uuid('game_id').references(() => games.id),
  pokemonId: integer('pokemon_id').notNull(),
  capturedAt: timestamp('captured_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.gameId, t.pokemonId] }),
}));

export const startingPokemon = pgTable('starting_pokemon', {
  gameId: uuid('game_id').primaryKey().references(() => games.id),
  pokemonId: integer('pokemon_id').notNull(),
  selectedAt: timestamp('selected_at', { withTimezone: true }).defaultNow(),
});
