# PokeAPI Documentation

---

## Table of Contents

- [Moves](#moves)
- [Move Categories](#move-categories)
- [Pokémon](#pokémon)
- [Pokémon Location Areas](#pokémon-location-areas)
- [Pokémon Species](#pokémon-species)
- [Stats](#stats)
- [Types](#types)

---

# Moves

## Moves (Endpoint)

Moves are the skills of Pokémon in battle. In battle, a Pokémon uses one move each turn. Some moves (including those learned by Hidden Machine) can be used outside of battle as well, usually for the purpose of removing obstacles or exploring new areas.

```
GET https://pokeapi.co/api/v2/move/{id or name}/
```

**Example response (pound):**

```json
{
  "id": 1,
  "name": "pound",
  "accuracy": 100,
  "effect_chance": null,
  "pp": 35,
  "priority": 0,
  "power": 40,
  "contest_combos": {
    "normal": {
      "use_before": [
        { "name": "double-slap", "url": "https://pokeapi.co/api/v2/move/3/" },
        { "name": "headbutt", "url": "https://pokeapi.co/api/v2/move/29/" },
        { "name": "feint-attack", "url": "https://pokeapi.co/api/v2/move/185/" }
      ],
      "use_after": null
    },
    "super": { "use_before": null, "use_after": null }
  },
  "contest_type": { "name": "tough", "url": "https://pokeapi.co/api/v2/contest-type/5/" },
  "contest_effect": { "url": "https://pokeapi.co/api/v2/contest-effect/1/" },
  "damage_class": { "name": "physical", "url": "https://pokeapi.co/api/v2/move-damage-class/2/" },
  "effect_entries": [
    {
      "effect": "Inflicts [regular damage]{mechanic:regular-damage}.",
      "short_effect": "Inflicts regular damage with no additional effect.",
      "language": { "name": "en", "url": "https://pokeapi.co/api/v2/language/9/" }
    }
  ],
  "generation": { "name": "generation-i", "url": "https://pokeapi.co/api/v2/generation/1/" },
  "names": [{ "name": "Pound", "language": { "name": "en", "url": "https://pokeapi.co/api/v2/language/9/" } }],
  "super_contest_effect": { "url": "https://pokeapi.co/api/v2/super-contest-effect/5/" },
  "target": { "name": "selected-pokemon", "url": "https://pokeapi.co/api/v2/move-target/10/" },
  "type": { "name": "normal", "url": "https://pokeapi.co/api/v2/type/1/" },
  "learned_by_pokemon": [{ "name": "clefairy", "url": "https://pokeapi.co/api/v2/pokemon/35/" }],
  "flavor_text_entries": [
    {
      "flavor_text": "Pounds with forelegs or tail.",
      "language": { "name": "en", "url": "https://pokeapi.co/api/v2/language/9/" },
      "version_group": { "name": "gold-silver", "url": "https://pokeapi.co/api/v2/version-group/3/" }
    }
  ]
}
```

---

## Move (Type)

| Name | Description | Type |
|------|-------------|------|
| `id` | The identifier for this resource. | integer |
| `name` | The name for this resource. | string |
| `accuracy` | The percent value of how likely this move is to be successful. | integer |
| `effect_chance` | The percent value of how likely it is this move's effect will happen. | integer |
| `pp` | Power points. The number of times this move can be used. | integer |
| `priority` | A value between -8 and 8. Sets the order in which moves are executed during battle. | integer |
| `power` | The base power of this move with a value of 0 if it does not have a base power. | integer |
| `contest_combos` | A detail of normal and super contest combos that require this move. | ContestComboSets |
| `contest_type` | The type of appeal this move gives a Pokémon when used in a contest. | NamedAPIResource (ContestType) |
| `contest_effect` | The effect the move has when used in a contest. | APIResource (ContestEffect) |
| `damage_class` | The type of damage the move inflicts on the target, e.g. physical. | NamedAPIResource (MoveDamageClass) |
| `effect_entries` | The effect of this move listed in different languages. | list VerboseEffect |
| `effect_changes` | The list of previous effects this move has had across version groups of the games. | list AbilityEffectChange |
| `learned_by_pokemon` | List of Pokémon that can learn the move. | list NamedAPIResource (Pokemon) |
| `flavor_text_entries` | The flavor text of this move listed in different languages. | list MoveFlavorText |
| `generation` | The generation in which this move was introduced. | NamedAPIResource (Generation) |
| `machines` | A list of the machines that teach this move. | list MachineVersionDetail |
| `meta` | Metadata about this move. | MoveMetaData |
| `names` | The name of this resource listed in different languages. | list Name |
| `past_values` | A list of move resource value changes across version groups of the game. | list PastMoveStatValues |
| `stat_changes` | A list of stats this move affects and how much it affects them. | list MoveStatChange |
| `super_contest_effect` | The effect the move has when used in a super contest. | APIResource (SuperContestEffect) |
| `target` | The type of target that will receive the effects of the attack. | NamedAPIResource (MoveTarget) |
| `type` | The elemental type of this move. | NamedAPIResource (Type) |

---

## ContestComboSets (Type)

| Name | Description | Type |
|------|-------------|------|
| `normal` | A detail of moves this move can be used before or after, granting additional appeal points in contests. | ContestComboDetail |
| `super` | A detail of moves this move can be used before or after, granting additional appeal points in super contests. | ContestComboDetail |

---

## ContestComboDetail (Type)

| Name | Description | Type |
|------|-------------|------|
| `use_before` | A list of moves to use before this move. | list NamedAPIResource (Move) |
| `use_after` | A list of moves to use after this move. | list NamedAPIResource (Move) |

---

## MoveFlavorText (Type)

| Name | Description | Type |
|------|-------------|------|
| `flavor_text` | The localized flavor text for an api resource in a specific language. | string |
| `language` | The language this name is in. | NamedAPIResource (Language) |
| `version_group` | The version group that uses this flavor text. | NamedAPIResource (VersionGroup) |

---

## MoveMetaData (Type)

| Name | Description | Type |
|------|-------------|------|
| `ailment` | The status ailment this move inflicts on its target. | NamedAPIResource (MoveAilment) |
| `category` | The category of move this move falls under, e.g. damage or ailment. | NamedAPIResource (MoveCategory) |
| `min_hits` | The minimum number of times this move hits. Null if it always only hits once. | integer |
| `max_hits` | The maximum number of times this move hits. Null if it always only hits once. | integer |
| `min_turns` | The minimum number of turns this move continues to take effect. Null if it always only lasts one turn. | integer |
| `max_turns` | The maximum number of turns this move continues to take effect. Null if it always only lasts one turn. | integer |
| `drain` | HP drain (if positive) or Recoil damage (if negative), in percent of damage done. | integer |
| `healing` | The amount of HP gained by the attacking Pokémon, in percent of its maximum HP. | integer |
| `crit_rate` | Critical hit rate bonus. | integer |
| `ailment_chance` | The likelihood this attack will cause an ailment. | integer |
| `flinch_chance` | The likelihood this attack will cause the target Pokémon to flinch. | integer |
| `stat_chance` | The likelihood this attack will cause a stat change in the target Pokémon. | integer |

---

## MoveStatChange (Type)

| Name | Description | Type |
|------|-------------|------|
| `change` | The amount of change. | integer |
| `stat` | The stat being affected. | NamedAPIResource (Stat) |

---

## PastMoveStatValues (Type)

| Name | Description | Type |
|------|-------------|------|
| `accuracy` | The percent value of how likely this move is to be successful. | integer |
| `effect_chance` | The percent value of how likely it is this move's effect will take effect. | integer |
| `power` | The base power of this move with a value of 0 if it does not have a base power. | integer |
| `pp` | Power points. The number of times this move can be used. | integer |
| `effect_entries` | The effect of this move listed in different languages. | list VerboseEffect |
| `type` | The elemental type of this move. | NamedAPIResource (Type) |
| `version_group` | The version group in which these move stat values were in effect. | NamedAPIResource (VersionGroup) |

---

# Move Categories

## Move Categories (Endpoint)

Very general categories that loosely group move effects.

```
GET https://pokeapi.co/api/v2/move-category/{id or name}/
```

**Example response (ailment):**

```json
{
  "id": 1,
  "name": "ailment",
  "descriptions": [
    {
      "description": "No damage; inflicts status ailment",
      "language": { "name": "en", "url": "https://pokeapi.co/api/v2/language/9/" }
    }
  ],
  "moves": [
    { "name": "sing", "url": "https://pokeapi.co/api/v2/move/47/" }
  ]
}
```

---

## MoveCategory (Type)

| Name | Description | Type |
|------|-------------|------|
| `id` | The identifier for this resource. | integer |
| `name` | The name for this resource. | string |
| `moves` | A list of moves that fall into this category. | list NamedAPIResource (Move) |
| `descriptions` | The description of this resource listed in different languages. | list Description |

---

# Pokémon

## Pokémon (Endpoint)

Pokémon are the creatures that inhabit the world of the Pokémon games. They can be caught using Pokéballs and trained by battling with other Pokémon. Each Pokémon belongs to a specific species but may take on a variant which makes it differ from other Pokémon of the same species, such as base stats, available abilities and typings.

```
GET https://pokeapi.co/api/v2/pokemon/{id or name}/
```

**Example response (clefairy):**

```json
{
  "id": 35,
  "name": "clefairy",
  "base_experience": 113,
  "height": 6,
  "is_default": true,
  "order": 56,
  "weight": 75,
  "abilities": [
    { "is_hidden": true, "slot": 3, "ability": { "name": "friend-guard", "url": "https://pokeapi.co/api/v2/ability/132/" } }
  ],
  "forms": [{ "name": "clefairy", "url": "https://pokeapi.co/api/v2/pokemon-form/35/" }],
  "game_indices": [
    { "game_index": 35, "version": { "name": "white-2", "url": "https://pokeapi.co/api/v2/version/22/" } }
  ],
  "held_items": [
    { "item": { "name": "moon-stone", "url": "https://pokeapi.co/api/v2/item/81/" }, "version_details": [] }
  ],
  "location_area_encounters": "/api/v2/pokemon/35/encounters",
  "moves": [
    { "move": { "name": "pound", "url": "https://pokeapi.co/api/v2/move/1/" }, "version_group_details": [] }
  ],
  "species": { "name": "clefairy", "url": "https://pokeapi.co/api/v2/pokemon-species/35/" },
  "cries": {
    "latest": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/35.ogg",
    "legacy": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/35.ogg"
  },
  "stats": [
    { "base_stat": 35, "effort": 0, "stat": { "name": "speed", "url": "https://pokeapi.co/api/v2/stat/6/" } }
  ],
  "types": [
    { "slot": 1, "type": { "name": "fairy", "url": "https://pokeapi.co/api/v2/type/18/" } }
  ],
  "past_types": [
    { "generation": { "name": "generation-v", "url": "https://pokeapi.co/api/v2/generation/5/" }, "types": [] },
    { "generation": { "name": "generation-iv", "url": "https://pokeapi.co/api/v2/generation/4/" }, "types": [] }
  ]
}
```

---

## Pokemon (Type)

| Name | Description | Type |
|------|-------------|------|
| `id` | The identifier for this resource. | integer |
| `name` | The name for this resource. | string |
| `base_experience` | The base experience gained for defeating this Pokémon. | integer |
| `height` | The height of this Pokémon in decimetres. | integer |
| `is_default` | Set for exactly one Pokémon used as the default for each species. | boolean |
| `order` | Order for sorting. Almost national order, except families are grouped together. | integer |
| `weight` | The weight of this Pokémon in hectograms. | integer |
| `abilities` | A list of abilities this Pokémon could potentially have. | list PokemonAbility |
| `forms` | A list of forms this Pokémon can take on. | list NamedAPIResource (PokemonForm) |
| `game_indices` | A list of game indices relevant to Pokémon item by generation. | list VersionGameIndex |
| `held_items` | A list of items this Pokémon may be holding when encountered. | list PokemonHeldItem |
| `location_area_encounters` | A link to a list of location areas, as well as encounter details pertaining to specific versions. | string |
| `moves` | A list of moves along with learn methods and level details pertaining to specific version groups. | list PokemonMove |
| `past_types` | A list of details showing types this Pokémon had in previous generations. | list PokemonTypePast |
| `past_abilities` | A list of details showing abilities this Pokémon had in previous generations. | list PokemonAbilityPast |
| `past_stats` | A list of details showing stats this Pokémon had in previous generations. | list PokemonStatPast |
| `sprites` | A set of sprites used to depict this Pokémon in the game. | PokemonSprites |
| `cries` | A set of cries used to depict this Pokémon in the game. | PokemonCries |
| `species` | The species this Pokémon belongs to. | NamedAPIResource (PokemonSpecies) |
| `stats` | A list of base stat values for this Pokémon. | list PokemonStat |
| `types` | A list of details showing types this Pokémon has. | list PokemonType |

---

## PokemonAbility (Type)

| Name | Description | Type |
|------|-------------|------|
| `is_hidden` | Whether or not this is a hidden ability. | boolean |
| `slot` | The slot this ability occupies in this Pokémon species. | integer |
| `ability` | The ability the Pokémon may have. | NamedAPIResource (Ability) |

---

## PokemonType (Type)

| Name | Description | Type |
|------|-------------|------|
| `slot` | The order the Pokémon's types are listed in. | integer |
| `type` | The type the referenced Pokémon has. | NamedAPIResource (Type) |

---

## PokemonFormType (Type)

| Name | Description | Type |
|------|-------------|------|
| `slot` | The order the Pokémon's types are listed in. | integer |
| `type` | The type the referenced Form has. | NamedAPIResource (Type) |

---

## PokemonTypePast (Type)

| Name | Description | Type |
|------|-------------|------|
| `generation` | The last generation in which the referenced Pokémon had the listed types. | NamedAPIResource (Generation) |
| `types` | The types the referenced Pokémon had up to and including the listed generation. | list PokemonType |

---

## PokemonAbilityPast (Type)

| Name | Description | Type |
|------|-------------|------|
| `generation` | The last generation in which the referenced Pokémon had the listed abilities. | NamedAPIResource (Generation) |
| `abilities` | The abilities the referenced Pokémon had up to and including the listed generation. If null, the slot was previously empty. | list PokemonAbility |

---

## PokemonStatPast (Type)

| Name | Description | Type |
|------|-------------|------|
| `generation` | The last generation in which the referenced Pokémon had the listed stats. | NamedAPIResource (Generation) |
| `stats` | The stat the Pokémon had up to and including the listed generation. | list PokemonStat |

---

## PokemonHeldItem (Type)

| Name | Description | Type |
|------|-------------|------|
| `item` | The item the referenced Pokémon holds. | NamedAPIResource (Item) |
| `version_details` | The details of the different versions in which the item is held. | list PokemonHeldItemVersion |

---

## PokemonHeldItemVersion (Type)

| Name | Description | Type |
|------|-------------|------|
| `version` | The version in which the item is held. | NamedAPIResource (Version) |
| `rarity` | How often the item is held. | integer |

---

## PokemonMove (Type)

| Name | Description | Type |
|------|-------------|------|
| `move` | The move the Pokémon can learn. | NamedAPIResource (Move) |
| `version_group_details` | The details of the version in which the Pokémon can learn the move. | list PokemonMoveVersion |

---

## PokemonMoveVersion (Type)

| Name | Description | Type |
|------|-------------|------|
| `move_learn_method` | The method by which the move is learned. | NamedAPIResource (MoveLearnMethod) |
| `version_group` | The version group in which the move is learned. | NamedAPIResource (VersionGroup) |
| `level_learned_at` | The minimum level to learn the move. | integer |
| `order` | Order by which the Pokémon will learn the move. A newly learnt move will replace the move with lowest order. | integer |

---

## PokemonStat (Type)

| Name | Description | Type |
|------|-------------|------|
| `stat` | The stat the Pokémon has. | NamedAPIResource (Stat) |
| `effort` | The effort points (EV) the Pokémon has in the stat. | integer |
| `base_stat` | The base value of the stat. | integer |

---

## PokemonSprites (Type)

| Name | Description | Type |
|------|-------------|------|
| `front_default` | The default depiction of this Pokémon from the front in battle. | string |
| `front_shiny` | The shiny depiction of this Pokémon from the front in battle. | string |
| `front_female` | The female depiction of this Pokémon from the front in battle. | string |
| `front_shiny_female` | The shiny female depiction of this Pokémon from the front in battle. | string |
| `back_default` | The default depiction of this Pokémon from the back in battle. | string |
| `back_shiny` | The shiny depiction of this Pokémon from the back in battle. | string |
| `back_female` | The female depiction of this Pokémon from the back in battle. | string |
| `back_shiny_female` | The shiny female depiction of this Pokémon from the back in battle. | string |

---

## PokemonCries (Type)

| Name | Description | Type |
|------|-------------|------|
| `latest` | The latest depiction of this Pokémon's cry. | string |
| `legacy` | The legacy depiction of this Pokémon's cry. | string |

---

# Pokémon Location Areas

## Pokémon Location Areas (Endpoint)

Pokémon Location Areas are areas where Pokémon can be found.

```
GET https://pokeapi.co/api/v2/pokemon/{id or name}/encounters
```

**Example response:**

```json
[
  {
    "location_area": {
      "name": "kanto-route-2-south-towards-viridian-city",
      "url": "https://pokeapi.co/api/v2/location-area/296/"
    },
    "version_details": []
  }
]
```

---

## LocationAreaEncounter (Type)

| Name | Description | Type |
|------|-------------|------|
| `location_area` | The location area the referenced Pokémon can be encountered in. | NamedAPIResource (LocationArea) |
| `version_details` | A list of versions and encounters with the referenced Pokémon that might happen. | list VersionEncounterDetail |

---

# Pokémon Species

## Pokémon Species (Endpoint)

A Pokémon Species forms the basis for at least one Pokémon. Attributes of a Pokémon species are shared across all varieties of Pokémon within the species. A good example is Wormadam; Wormadam is the species which can be found in three different varieties, Wormadam-Trash, Wormadam-Sandy and Wormadam-Plant.

```
GET https://pokeapi.co/api/v2/pokemon-species/{id or name}/
```

**Example response (wormadam):**

```json
{
  "id": 413,
  "name": "wormadam",
  "order": 441,
  "gender_rate": 8,
  "capture_rate": 45,
  "base_happiness": 70,
  "is_baby": false,
  "is_legendary": false,
  "is_mythical": false,
  "hatch_counter": 15,
  "has_gender_differences": false,
  "forms_switchable": false,
  "growth_rate": { "name": "medium", "url": "https://pokeapi.co/api/v2/growth-rate/2/" },
  "pokedex_numbers": [
    { "entry_number": 45, "pokedex": { "name": "kalos-central", "url": "https://pokeapi.co/api/v2/pokedex/12/" } }
  ],
  "egg_groups": [{ "name": "bug", "url": "https://pokeapi.co/api/v2/egg-group/3/" }],
  "color": { "name": "gray", "url": "https://pokeapi.co/api/v2/pokemon-color/4/" },
  "shape": { "name": "squiggle", "url": "https://pokeapi.co/api/v2/pokemon-shape/2/" },
  "evolves_from_species": { "name": "burmy", "url": "https://pokeapi.co/api/v2/pokemon-species/412/" },
  "evolution_chain": { "url": "https://pokeapi.co/api/v2/evolution-chain/213/" },
  "habitat": null,
  "generation": { "name": "generation-iv", "url": "https://pokeapi.co/api/v2/generation/4/" },
  "names": [{ "name": "Wormadam", "language": { "name": "en", "url": "https://pokeapi.co/api/v2/language/9/" } }],
  "flavor_text_entries": [
    {
      "flavor_text": "When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs.",
      "language": { "name": "en", "url": "https://pokeapi.co/api/v2/language/9/" },
      "version": { "name": "red", "url": "https://pokeapi.co/api/v2/version/1/" }
    }
  ],
  "form_descriptions": [
    {
      "description": "Forms have different stats and movepools. During evolution, Burmy's current cloak becomes Wormadam's form, and can no longer be changed.",
      "language": { "name": "en", "url": "https://pokeapi.co/api/v2/language/9/" }
    }
  ],
  "genera": [{ "genus": "Bagworm", "language": { "name": "en", "url": "https://pokeapi.co/api/v2/language/9/" } }],
  "varieties": [
    { "is_default": true, "pokemon": { "name": "wormadam-plant", "url": "https://pokeapi.co/api/v2/pokemon/413/" } }
  ]
}
```

---

## PokemonSpecies (Type)

| Name | Description | Type |
|------|-------------|------|
| `id` | The identifier for this resource. | integer |
| `name` | The name for this resource. | string |
| `order` | The order in which species should be sorted. Based on National Dex order, except families are grouped together and sorted by stage. | integer |
| `gender_rate` | The chance of this Pokémon being female, in eighths; or -1 for genderless. | integer |
| `capture_rate` | The base capture rate; up to 255. The higher the number, the easier the catch. | integer |
| `base_happiness` | The happiness when caught by a normal Pokéball; up to 255. The higher the number, the happier the Pokémon. | integer |
| `is_baby` | Whether or not this is a baby Pokémon. | boolean |
| `is_legendary` | Whether or not this is a legendary Pokémon. | boolean |
| `is_mythical` | Whether or not this is a mythical Pokémon. | boolean |
| `hatch_counter` | Initial hatch counter: one must walk Y × (hatch_counter + 1) steps before this Pokémon's egg hatches. Y varies per generation. | integer |
| `has_gender_differences` | Whether or not this Pokémon has visual gender differences. | boolean |
| `forms_switchable` | Whether or not this Pokémon has multiple forms and can switch between them. | boolean |
| `growth_rate` | The rate at which this Pokémon species gains levels. | NamedAPIResource (GrowthRate) |
| `pokedex_numbers` | A list of Pokédexes and the indexes reserved within them for this Pokémon species. | list PokemonSpeciesDexEntry |
| `egg_groups` | A list of egg groups this Pokémon species is a member of. | list NamedAPIResource (EggGroup) |
| `color` | The color of this Pokémon for Pokédex search. | NamedAPIResource (PokemonColor) |
| `shape` | The shape of this Pokémon for Pokédex search. | NamedAPIResource (PokemonShape) |
| `evolves_from_species` | The Pokémon species that evolves into this Pokémon species. | NamedAPIResource (PokemonSpecies) |
| `evolution_chain` | The evolution chain this Pokémon species is a member of. | APIResource (EvolutionChain) |
| `habitat` | The habitat this Pokémon species can be encountered in. | NamedAPIResource (PokemonHabitat) |
| `generation` | The generation this Pokémon species was introduced in. | NamedAPIResource (Generation) |
| `names` | The name of this resource listed in different languages. | list Name |
| `pal_park_encounters` | A list of encounters that can be had with this Pokémon species in pal park. | list PalParkEncounterArea |
| `flavor_text_entries` | A list of flavor text entries for this Pokémon species. | list FlavorText |
| `form_descriptions` | Descriptions of different forms Pokémon take on within the Pokémon species. | list Description |
| `genera` | The genus of this Pokémon species listed in multiple languages. | list Genus |
| `varieties` | A list of the Pokémon that exist within this Pokémon species. | list PokemonSpeciesVariety |

---

## Genus (Type)

| Name | Description | Type |
|------|-------------|------|
| `genus` | The localized genus for the referenced Pokémon species. | string |
| `language` | The language this genus is in. | NamedAPIResource (Language) |

---

## PokemonSpeciesDexEntry (Type)

| Name | Description | Type |
|------|-------------|------|
| `entry_number` | The index number within the Pokédex. | integer |
| `pokedex` | The Pokédex the referenced Pokémon species can be found in. | NamedAPIResource (Pokedex) |

---

## PalParkEncounterArea (Type)

| Name | Description | Type |
|------|-------------|------|
| `base_score` | The base score given to the player when the referenced Pokémon is caught during a pal park run. | integer |
| `rate` | The base rate for encountering the referenced Pokémon in this pal park area. | integer |
| `area` | The pal park area where this encounter happens. | NamedAPIResource (PalParkArea) |

---

## PokemonSpeciesVariety (Type)

| Name | Description | Type |
|------|-------------|------|
| `is_default` | Whether this variety is the default variety. | boolean |
| `pokemon` | The Pokémon variety. | NamedAPIResource (Pokemon) |

---

# Stats

## Stats (Endpoint)

Stats determine certain aspects of battles. Each Pokémon has a value for each stat which grows as they gain levels and can be altered momentarily by effects in battles.

```
GET https://pokeapi.co/api/v2/stat/{id or name}/
```

**Example response (attack):**

```json
{
  "id": 2,
  "name": "attack",
  "game_index": 2,
  "is_battle_only": false,
  "affecting_moves": {
    "increase": [{ "change": 2, "move": { "name": "swords-dance", "url": "https://pokeapi.co/api/v2/move/14/" } }],
    "decrease": [{ "change": -1, "move": { "name": "growl", "url": "https://pokeapi.co/api/v2/move/45/" } }]
  },
  "affecting_natures": {
    "increase": [{ "name": "lonely", "url": "https://pokeapi.co/api/v2/nature/6/" }],
    "decrease": [{ "name": "bold", "url": "https://pokeapi.co/api/v2/nature/2/" }]
  },
  "characteristics": [{ "url": "https://pokeapi.co/api/v2/characteristic/2/" }],
  "move_damage_class": { "name": "physical", "url": "https://pokeapi.co/api/v2/move-damage-class/2/" },
  "names": [{ "name": "こうげき", "language": { "name": "ja", "url": "https://pokeapi.co/api/v2/language/1/" } }]
}
```

---

## Stat (Type)

| Name | Description | Type |
|------|-------------|------|
| `id` | The identifier for this resource. | integer |
| `name` | The name for this resource. | string |
| `game_index` | ID the games use for this stat. | integer |
| `is_battle_only` | Whether this stat only exists within a battle. | boolean |
| `affecting_moves` | A detail of moves which affect this stat positively or negatively. | MoveStatAffectSets |
| `affecting_natures` | A detail of natures which affect this stat positively or negatively. | NatureStatAffectSets |
| `characteristics` | A list of characteristics that are set on a Pokémon when its highest base stat is this stat. | list APIResource (Characteristic) |
| `move_damage_class` | The class of damage this stat is directly related to. | NamedAPIResource (MoveDamageClass) |
| `names` | The name of this resource listed in different languages. | list Name |

---

## MoveStatAffectSets (Type)

| Name | Description | Type |
|------|-------------|------|
| `increase` | A list of moves and how they change the referenced stat. | list MoveStatAffect |
| `decrease` | A list of moves and how they change the referenced stat. | list MoveStatAffect |

---

## MoveStatAffect (Type)

| Name | Description | Type |
|------|-------------|------|
| `change` | The maximum amount of change to the referenced stat. | integer |
| `move` | The move causing the change. | NamedAPIResource (Move) |

---

## NatureStatAffectSets (Type)

| Name | Description | Type |
|------|-------------|------|
| `increase` | A list of natures and how they change the referenced stat. | list NamedAPIResource (Nature) |
| `decrease` | A list of natures and how they change the referenced stat. | list NamedAPIResource (Nature) |

---

# Types

## Types (Endpoint)

Types are properties for Pokémon and their moves. Each type has three properties: which types of Pokémon it is super effective against, which types of Pokémon it is not very effective against, and which types of Pokémon it is completely ineffective against.

```
GET https://pokeapi.co/api/v2/type/{id or name}/
```

**Example response (ground):**

```json
{
  "id": 5,
  "name": "ground",
  "damage_relations": {},
  "past_damage_relations": [
    { "generation": { "name": "generation-i", "url": "https://pokeapi.co/api/v2/generation/1/" }, "damage_relations": {} }
  ],
  "game_indices": [
    { "game_index": 4, "generation": { "name": "generation-i", "url": "https://pokeapi.co/api/v2/generation/1/" } }
  ],
  "generation": { "name": "generation-v", "url": "https://pokeapi.co/api/v2/generation/5/" },
  "move_damage_class": { "name": "physical", "url": "https://pokeapi.co/api/v2/move-damage-class/2/" },
  "names": [{ "name": "じめん", "language": { "name": "ja", "url": "https://pokeapi.co/api/v2/language/1/" } }],
  "pokemon": [
    { "slot": 1, "pokemon": { "name": "sandshrew", "url": "https://pokeapi.co/api/v2/pokemon/27/" } }
  ],
  "moves": [
    { "name": "sand-attack", "url": "https://pokeapi.co/api/v2/move/28/" }
  ]
}
```

---

## Type (Type)

| Name | Description | Type |
|------|-------------|------|
| `id` | The identifier for this resource. | integer |
| `name` | The name for this resource. | string |
| `damage_relations` | A detail of how effective this type is toward others and vice versa. | TypeRelations |
| `past_damage_relations` | A list of details of how effective this type was toward others and vice versa in previous generations. | list TypeRelationsPast |
| `game_indices` | A list of game indices relevant to this item by generation. | list GenerationGameIndex |
| `generation` | The generation this type was introduced in. | NamedAPIResource (Generation) |
| `move_damage_class` | The class of damage inflicted by this type. | NamedAPIResource (MoveDamageClass) |
| `names` | The name of this resource listed in different languages. | list Name |
| `pokemon` | A list of details of Pokémon that have this type. | list TypePokemon |
| `moves` | A list of moves that have this type. | list NamedAPIResource (Move) |

---

## TypePokemon (Type)

| Name | Description | Type |
|------|-------------|------|
| `slot` | The order the Pokémon's types are listed in. | integer |
| `pokemon` | The Pokémon that has the referenced type. | NamedAPIResource (Pokemon) |

---

## TypeRelations (Type)

| Name | Description | Type |
|------|-------------|------|
| `no_damage_to` | A list of types this type has no effect on. | list NamedAPIResource (Type) |
| `half_damage_to` | A list of types this type is not very effective against. | list NamedAPIResource (Type) |
| `double_damage_to` | A list of types this type is very effective against. | list NamedAPIResource (Type) |
| `no_damage_from` | A list of types that have no effect on this type. | list NamedAPIResource (Type) |
| `half_damage_from` | A list of types that are not very effective against this type. | list NamedAPIResource (Type) |
| `double_damage_from` | A list of types that are very effective against this type. | list NamedAPIResource (Type) |

---

## TypeRelationsPast (Type)

| Name | Description | Type |
|------|-------------|------|
| `generation` | The last generation in which the referenced type had the listed damage relations. | NamedAPIResource (Generation) |
| `damage_relations` | The damage relations the referenced type had up to and including the listed generation. | TypeRelations |
