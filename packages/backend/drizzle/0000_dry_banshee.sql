CREATE TABLE IF NOT EXISTS "captured_pokemon" (
	"game_id" uuid,
	"pokemon_id" integer NOT NULL,
	"captured_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "captured_pokemon_game_id_pokemon_id_pk" PRIMARY KEY("game_id","pokemon_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"state" varchar(40) DEFAULT 'SELECTING_STARTING_POKEMON' NOT NULL,
	"current_area_id" integer,
	"wild_pokemon_id" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "starting_pokemon" (
	"game_id" uuid PRIMARY KEY NOT NULL,
	"pokemon_id" integer NOT NULL,
	"selected_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "captured_pokemon" ADD CONSTRAINT "captured_pokemon_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "starting_pokemon" ADD CONSTRAINT "starting_pokemon_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
