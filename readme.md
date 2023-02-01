- [Card Battler API](#card-battler-api)
  - [Introduction](#introduction)
  - [Endpoints](#endpoints)
    - [Players](#players)
    - [Games](#games)
    - [Decks](#decks)
    - [Characters](#characters)
    - [Cards](#cards)

# Card Battler API

## Introduction

A NodeJS and Express API for a single player, deck collection, turn based, battle game. The gameplay will be similar to [Slay the Spire](https://store.steampowered.com/app/646570/Slay_the_Spire/)

## Endpoints

Below are the endpoints.

Note: this game is in active development, so the endpoints are likely to change

### Players

-   \[POST\] `/players` - create a new player. Body should be `{"username": "whatever"}`
-   \[GET\] `/players/:id` - get the player matching the id. id is a Mongo ObjectId
-   \[GET\] `/players/username/:username` - get a player matching the username
-   \[GET\] `/players/:id/games` - get all games for the player
-   \[POST\] `/players/:id/games` - create a new game for the player
-   \[GET\] `/players/:id/games/:id` - get a specific game associated with a player

### Games

-   \[GET\] `/games/:id` - get the game matching the id. id is a Mongo ObjectId
-   \[DELETE\] `/games/:id` - delete the game. Note: this is a hard delete. The game is removed from the database
-   \[PATCH\] `/games/:id/:attribute/:operation/:value` - update the attribute on the game using the operation and the value. Valid operations include: add (for numbers and arrays), subtract (for numbers), assign (for strings and numbers), and remove (for arrays). Example:
    -   `/games/:id/level/add/1`
    -   `/games/:id/status/assign/paused`
    -   `/games/:id/score/subtract/10`

### Decks

-   \[POST\] `/decks` - create a new deck. Body can contain optional data such as game, character, etc.
-   \[GET\] `/decks/:id` - get the deck matching the id. id is a Mongo ObjectId
-   \[PATCH\] `/decks/:id/:attribute/:operation/:value` - update the attribute on the deck using the operation and the value. Example:
    -   `/decks/:id/game/assign/<gameID>`
    -   `/decks/:id/starter/assign/true`
    -   Coming soon: being able to update the cards in the deck using this endpoint
-   \[DELETE\] `/decks/:id` - delete the deck. Note: this is a hard delete. The deck is removed from the database

### Characters

Coming soon!

### Cards

Coming soon!
