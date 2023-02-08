# Card Battler API <!-- omit from toc -->

![nycrc config on GitHub](https://img.shields.io/nycrc/woollyblanket/card-battler-backend) [![codecov](https://codecov.io/gh/woollyblanket/card-battler-backend/branch/main/graph/badge.svg?token=7WSYG75UDX)](https://codecov.io/gh/woollyblanket/card-battler-backend) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/woollyblanket/card-battler-backend/node.js.yml) ![GitHub repo size](https://img.shields.io/github/repo-size/woollyblanket/card-battler-backend) ![GitHub](https://img.shields.io/github/license/woollyblanket/card-battler-backend) ![GitHub last commit](https://img.shields.io/github/last-commit/woollyblanket/card-battler-backend) ![Code Climate technical debt](https://img.shields.io/codeclimate/tech-debt/woollyblanket/card-battler-backend) ![Code Climate issues](https://img.shields.io/codeclimate/issues/woollyblanket/card-battler-backend) ![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/woollyblanket/card-battler-backend)

-   [Introduction](#introduction)
-   [Endpoints](#endpoints)
    -   [Players](#players)
    -   [Games](#games)
    -   [Decks](#decks)
    -   [Cards](#cards)
    -   [Abilities](#abilities)
    -   [Characters](#characters)
    -   [Enemies](#enemies)

## Introduction

A NodeJS and Express API for a single player, deck collection, turn based, battle game. The gameplay will be similar to [Slay the Spire](https://store.steampowered.com/app/646570/Slay_the_Spire/)

## Endpoints

Below are the endpoints.

Note: this game is in active development, so the endpoints are likely to change

### Players

The database schema for this entity is [here](https://github.com/woollyblanket/card-battler-backend/blob/b63a5931dd6ec0b300f321b6836d73ff722fce3c/components/players/schema.js#L7-L10)

-   \[POST\] `/players` - create a new player. Body should be `{"username": "whatever"}`
-   \[GET\] `/players/:id` - get the player matching the id. id is a Mongo ObjectId
-   \[GET\] `/players/username/:username` - get a player matching the username
-   \[GET\] `/players/:id/games` - get all games for the player
-   \[POST\] `/players/:id/games` - create a new game for the player
-   \[GET\] `/players/:id/games/:id` - get a specific game associated with a player

### Games

The database schema for this entity is [here](https://github.com/woollyblanket/card-battler-backend/blob/b63a5931dd6ec0b300f321b6836d73ff722fce3c/components/games/schema.js#L7-L17)

-   \[GET\] `/games/:id` - get the game matching the id. id is a Mongo ObjectId
-   \[DELETE\] `/games/:id` - delete the game. Note: this is a hard delete. The game is removed from the database
-   \[PATCH\] `/games/:id/:attribute/:operation/:value` - update the attribute on the game using the operation and the value. Valid operations include: add (for numbers and arrays), subtract (for numbers), assign (for strings and numbers), and remove (for arrays). Example:
    -   `/games/:id/level/add/1`
    -   `/games/:id/status/assign/paused`
    -   `/games/:id/score/subtract/10`

### Decks

The database schema for this entity is [here](https://github.com/woollyblanket/card-battler-backend/blob/b63a5931dd6ec0b300f321b6836d73ff722fce3c/components/decks/schema.js#L7-L12)

-   \[POST\] `/decks` - create a new deck. Body can contain optional data such as game, character, etc.
-   \[GET\] `/decks/:id` - get the deck matching the id. id is a Mongo ObjectId
-   \[PATCH\] `/decks/:id/:attribute/:operation/:value` - update the attribute on the deck using the operation and the value. Example:
    -   `/decks/:id/game/assign/<gameID>`
    -   `/decks/:id/starter/assign/true`
    -   `/decks/:id/cards/add/<cardID>`
    -   `/decks/:id/cards/remove/<cardID>`
-   \[DELETE\] `/decks/:id` - delete the deck. Note: this is a hard delete. The deck is removed from the database

### Cards

The database schema for this entity is [here](https://github.com/woollyblanket/card-battler-backend/blob/b63a5931dd6ec0b300f321b6836d73ff722fce3c/components/cards/schema.js#L4-L14)

-   \[POST\] `/cards` - create a new card. Body should be (at minimum) `{"name": "test","type": "healer","description": "this is a test card"}` Type can be a number of options, such as "attacker", "healer", "shield", "buff", "debuff"
-   \[GET\] `/cards/:id` - get the card matching the id. id is a Mongo ObjectId
-   \[PATCH\] `/cards/:id/:attribute/:operation/:value` - update the attribute on the card using the operation and the value. Example:
    -   `/cards/:id/name/assign/test2`
    -   `/cards/:id/type/assign/debuff`
-   \[DELETE\] `/cards/:id` - delete the card. Note: this is a hard delete. The card is removed from the database

### Abilities

The database schema for this entity is [here](https://github.com/woollyblanket/card-battler-backend/blob/b63a5931dd6ec0b300f321b6836d73ff722fce3c/components/abilities/schema.js#L4-L13)

-   \[POST\] `/abilities` - create a new ability. Body should be (at minimum) `{"name": "test","type": "buff","description": "this is a test ability"}` Type can be a number of options, such as "buff", "debuff" and "buff-debuff"
-   \[GET\] `/abilities/:id` - get the ability matching the id. id is a Mongo ObjectId
-   \[PATCH\] `/abilities/:id/:attribute/:operation/:value` - update the attribute on the ability using the operation and the value. Example:
    -   `/abilities/:id/energy/assign/+4`
    -   `/abilities/:id/type/assign/debuff`
-   \[DELETE\] `/abilities/:id` - delete the ability. Note: this is a hard delete. The ability is removed from the database

### Characters

The database schema for this entity is [here](https://github.com/woollyblanket/card-battler-backend/blob/b63a5931dd6ec0b300f321b6836d73ff722fce3c/components/characters/schema.js#L4-L15)

-   \[POST\] `/characters` - create a new character. Body should be (at minimum) `{"name": "test","archetype": "hero","description": "test"}`
-   \[GET\] `/characters/:id` - get the character matching the id. id is a Mongo ObjectId
-   \[PATCH\] `/characters/:id/:attribute/:operation/:value` - update the attribute on the character using the operation and the value. Example:
    -   `/characters/:id/health/add/4`
    -   `/characters/:id/energy/subtract/1`
    -   `/characters/:id/abilities/add/<abilityID>`
    -   `/characters/:id/abilities/remove/<abilityID>`
-   \[DELETE\] `/characters/:id` - delete the character. Note: this is a hard delete. The character is removed from the database

### Enemies

The database schema for this entity is [here](https://github.com/woollyblanket/card-battler-backend/blob/b63a5931dd6ec0b300f321b6836d73ff722fce3c/components/enemies/schema.js#L4-L15)

-   \[POST\] `/enemies` - create a new enemy. Body should be (at minimum) `{"name": "test","species": "hero","description": "test"}`
-   \[GET\] `/enemies/:id` - get the enemy matching the id. id is a Mongo ObjectId
-   \[PATCH\] `/enemies/:id/:attribute/:operation/:value` - update the attribute on the enemy using the operation and the value. Example:
    -   `/enemies/:id/health/add/4`
    -   `/enemies/:id/energy/subtract/1`
    -   `/enemies/:id/abilities/add/<abilityID>`
    -   `/enemies/:id/abilities/remove/<abilityID>`
-   \[DELETE\] `/enemies/:id` - delete the enemy. Note: this is a hard delete. The enemy is removed from the database
