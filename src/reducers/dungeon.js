import * as DungeonActionTypes from '../actiontypes/dungeon';

const MAP_WIDTH = 50;
const MAP_HEIGHT = 30;
const ENEMY_ZERO_HEALTH = 5;
const NUM_ENEMIES = 4;
const NUM_HEALTH = 4;
const MIN_ROOM_SIZE = 5;
const MAX_ROOM_SIZE = 12;

export const Block = {
  EMPTY: 0,
  PLAYER: 1,
  HEALTH: 2,
  WEAPON: 3,
  WALL: 4,
  PORTAL: 5,
  ENEMY: 30,
  BOSS: 400,
};

export const WEAPONS = {
  0: 'Hands',
  1: 'Knife',
  2: 'Mace',
  3: 'Sword',
  4: 'Battle Axe',
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPlaceBlock(map, blockType) {
  let startingRow = 0;
  let startingCol = 0;
  let placed = false;
  while (!placed) {
    startingRow = Math.floor(Math.random() * Math.floor(MAP_HEIGHT));
    startingCol = Math.floor(Math.random() * Math.floor(MAP_WIDTH));
    if (map[startingRow][startingCol] === Block.EMPTY) {
      map[startingRow][startingCol] = blockType;
      placed = true;
    }
  }
  return [startingRow, startingCol];
}

function makeRoom(map, row, col) {
  const roomHeight = getRandomInt(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
  const roomWidth = getRandomInt(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
  for (let i = 0; i < roomHeight; i += 1) {
    for (let j = 0; j < roomWidth; j += 1) {
      console.log((row + i) - (roomHeight / 2));
      map[row + i - Math.floor(roomHeight / 2)][col + j - Math.floor(roomWidth / 2)] = Block.EMPTY;
    }
  }
  return map;
}

function generateMapAndPlayerCoordinates(currentDungeon) {
  const initialMap = new Array(MAP_HEIGHT);
  for (let i = 0; i < MAP_HEIGHT; i += 1) {
    initialMap[i] = new Array(MAP_WIDTH);
    for (let j = 0; j < MAP_WIDTH; j += 1) {
      initialMap[i][j] = Block.EMPTY;
    }
  }

  // initialMap = makeRoom(initialMap, MAP_HEIGHT/2, MAP_WIDTH/2);

  initialMap[0] = initialMap[0].map(() => (
    Block.WALL
  ));
  initialMap[MAP_HEIGHT - 1] = initialMap[MAP_HEIGHT - 1].map(() => (
    Block.WALL
  ));
  initialMap.forEach((row) => {
    row[0] = Block.WALL;
    row[MAP_WIDTH - 1] = Block.WALL;
  });

  const playerStartingCoordinates = randomPlaceBlock(initialMap, Block.PLAYER);
  const playerStartingRow = playerStartingCoordinates[0];
  const playerStartingCol = playerStartingCoordinates[1];

  randomPlaceBlock(initialMap, Block.WEAPON);
  for (let i = 0; i < NUM_HEALTH; i += 1) {
    randomPlaceBlock(initialMap, Block.HEALTH);
  }
  for (let i = 0; i < NUM_ENEMIES; i += 1) {
    randomPlaceBlock(initialMap, Block.ENEMY * (currentDungeon + 1));
  }
  if (currentDungeon === 3) {
    randomPlaceBlock(initialMap, Block.BOSS);
  } else {
    randomPlaceBlock(initialMap, Block.PORTAL);
  }

  return [initialMap, playerStartingRow, playerStartingCol];
}

function resetMap() {
  const mapAndPos = generateMapAndPlayerCoordinates(0);
  return {
    ...initialState,
    map: mapAndPos[0],
    playerCoordinates: {
      row: mapAndPos[1],
      col: mapAndPos[2],
    },
  };
}

const initialMapAndPlayerCoordinates = generateMapAndPlayerCoordinates(0);
const initialMap = initialMapAndPlayerCoordinates[0];
const initialRow = initialMapAndPlayerCoordinates[1];
const initialCol = initialMapAndPlayerCoordinates[2];

const initialState = {
  map: initialMap,
  playerHealth: 100,
  weaponLevel: 0,
  playerWeapon: WEAPONS[0],
  playerAttack: 3,
  playerLevel: 1,
  playerXPToNextLevel: 20,
  playerCoordinates: {
    row: initialRow,
    col: initialCol,
  },
  currentDungeon: 0,
  lightsOn: true,
  bossHealth: Block.BOSS,
};

export default function Dungeon(state = initialState, action) {
  switch (action.type) {
    case DungeonActionTypes.TOGGLE_LIGHTS: {
      return {
        ...state,
        lightsOn: !state.lightsOn,
      };
    }

    case DungeonActionTypes.MOVE: {
      let newRow;
      let newCol;
      switch (action.direction) {
        case 'Up':
          newRow = state.playerCoordinates.row - 1;
          newCol = state.playerCoordinates.col;
          break;

        case 'Right':
          newRow = state.playerCoordinates.row;
          newCol = state.playerCoordinates.col + 1;
          break;

        case 'Down':
          newRow = state.playerCoordinates.row + 1;
          newCol = state.playerCoordinates.col;
          break;

        case 'Left':
          newRow = state.playerCoordinates.row;
          newCol = state.playerCoordinates.col - 1;
          break;

        default:
          return state;
      }

      const outOfBounds = (newRow < 0 || newCol < 0 || newRow >= MAP_HEIGHT || newCol >= MAP_WIDTH);
      if (outOfBounds) {
        return state;
      }

      const newMap = [...state.map];
      let newPlayerHealth = state.playerHealth;
      let newWeaponLevel = state.weaponLevel;
      let newPlayerAttack = state.playerAttack;
      let newPlayerXPToNextLevel = state.playerXPToNextLevel;
      let newPlayerLevel = state.playerLevel;
      let newBossHealth = state.bossHealth;

      switch (state.map[newRow][newCol]) {
        case Block.EMPTY:
          break;

        case Block.HEALTH:
          newPlayerHealth += 20;
          break;

        case Block.WEAPON:
          newWeaponLevel += newWeaponLevel < 5 ? 1 : 0;
          newPlayerAttack += 7;
          break;

        case Block.WALL:
          return state;

        case Block.PORTAL: {
          const newDungeon = state.currentDungeon + 1;
          const mapAndPos = generateMapAndPlayerCoordinates(newDungeon);
          return {
            ...state,
            map: mapAndPos[0],
            playerCoordinates: {
              row: mapAndPos[1],
              col: mapAndPos[2],
            },
            currentDungeon: newDungeon,
          };
        }

        case Block.BOSS: {
          newBossHealth -= getRandomInt(state.playerAttack - 1, state.playerAttack + 1);
          console.log('boss:', newBossHealth);
          if (newBossHealth < ENEMY_ZERO_HEALTH) {
            alert('You beat the boss. You Won!');
            return resetMap();
          }
          newPlayerHealth -= getRandomInt(45,55);
          if (newPlayerHealth <= 0) {
            alert('You Died');
            return resetMap();
          }
          newRow = state.playerCoordinates.row;
          newCol = state.playerCoordinates.col;
          break;
        }

        default: { // enemy
          let enemyHealth = state.map[newRow][newCol];
          enemyHealth -= getRandomInt(state.playerAttack - 1, state.playerAttack + 1);
          if (enemyHealth <= ENEMY_ZERO_HEALTH) {
            newPlayerXPToNextLevel -= 20 * (state.currentDungeon + 1);
            if (newPlayerXPToNextLevel <= 0) { // TODO: account for rollover
              newPlayerLevel += 1;
              newPlayerAttack += 10;
              newPlayerHealth += 40;
              newPlayerXPToNextLevel = newPlayerLevel * 40;
            }
          } else {
            newPlayerHealth -= getRandomInt(10 * (state.currentDungeon + 1) - 1, 10 * (state.currentDungeon + 1) + 1);
            if (newPlayerHealth <= 0) {
              alert('You Died!');
              return resetMap();
            }
            newMap[newRow][newCol] = enemyHealth;
            newRow = state.playerCoordinates.row;
            newCol = state.playerCoordinates.col;
          }
          break;
        }
      }

      newMap[state.playerCoordinates.row][state.playerCoordinates.col] = Block.EMPTY;
      newMap[newRow][newCol] = Block.PLAYER;
      return {
        ...state,
        map: newMap,
        playerCoordinates: {
          row: newRow,
          col: newCol,
        },
        playerHealth: newPlayerHealth,
        weaponLevel: newWeaponLevel,
        playerWeapon: WEAPONS[newWeaponLevel],
        playerAttack: newPlayerAttack,
        playerXPToNextLevel: newPlayerXPToNextLevel,
        playerLevel: newPlayerLevel,
        bossHealth: newBossHealth,
      };
    }

    default:
      return state;
  }
}
