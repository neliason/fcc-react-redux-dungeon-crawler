import * as DungeonActionTypes from '../actiontypes/dungeon';

const MAP_WIDTH = 50;
const MAP_HEIGHT = 30;
const ENEMY_ZERO_HEALTH = 4;
const NUM_ENEMIES = 4;

const Block = {
  EMPTY: 0,
  PLAYER: 1,
  HEALTH: 2,
  WEAPON: 3,
  WALL: 4,
  ENEMY_LVL_1: 40,
  BOSS: 1000
}

const WEAPONS = {
  0: "Hands",
  1: "Knife",
  2: "Mace",
  3: "Sword",
  4: "Battle Axe"
}

function generateInitialMapAndPlayerCoordinates() {
  let initialMap = new Array(MAP_HEIGHT);
  for (let i = 0; i < MAP_HEIGHT; i++) {
    initialMap[i] = new Array(MAP_WIDTH);
    for (let j = 0; j < MAP_WIDTH; j++) {
      initialMap[i][j] = 0;
    }
  }
  initialMap[0][0] = Block.WALL;

  const playerStartingCoordinates = randomPlaceBlock(initialMap, Block.PLAYER);
  const playerStartingRow = playerStartingCoordinates[0];
  const playerStartingCol = playerStartingCoordinates[1];
  
  randomPlaceBlock(initialMap, Block.HEALTH);
  randomPlaceBlock(initialMap, Block.WEAPON);
  for(let i = 0; i < NUM_ENEMIES; i++) {
    randomPlaceBlock(initialMap, Block.ENEMY_LVL_1);
  }
  randomPlaceBlock(initialMap, Block.BOSS)

  return [initialMap, playerStartingRow, playerStartingCol];
}

function getNewMap() {
  const mapAndPos = generateInitialMapAndPlayerCoordinates();
  return {
    ...initialState,
    map: mapAndPos[0],
    playerCoordinates: {
      row: mapAndPos[1],
      col: mapAndPos[2]
    }
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPlaceBlock(map, blockType) {
  let startingRow = 0;
  let startingCol = 0;
  let placed = false;
  while(!placed) {
    startingRow = Math.floor(Math.random() * Math.floor(MAP_HEIGHT));
    startingCol = Math.floor(Math.random() * Math.floor(MAP_WIDTH));
    if(map[startingRow][startingCol] === Block.EMPTY) {
      map[startingRow][startingCol] = blockType;
      placed = true;
    }
  }
  return [startingRow, startingCol];
}

const initialMapAndPlayerCoordinates = generateInitialMapAndPlayerCoordinates();

const initialState = {
  map: initialMapAndPlayerCoordinates[0],
  playerHealth: 25,
  weaponLevel: 0,
  playerWeapon: WEAPONS[0],
  playerAttack: 3,
  playerLevel: 1,
  playerXPToNextLevel: 20,
  playerCoordinates: {
    row: initialMapAndPlayerCoordinates[1],
    col: initialMapAndPlayerCoordinates[2]
  },
  currentDungeon: 0
}

export default function Dungeon(state=initialState, action) {
  switch(action.type) {
    case DungeonActionTypes.ATTACK: {
      return state;
    }

    case DungeonActionTypes.MOVE: {
      let newRow;
      let newCol;
      switch(action.direction) {
        case "Up":
          newRow = state.playerCoordinates.row - 1;
          newCol = state.playerCoordinates.col;
          break;

        case "Right":
          newRow = state.playerCoordinates.row;
          newCol = state.playerCoordinates.col + 1;
          break;

        case "Down":
          newRow = state.playerCoordinates.row + 1;
          newCol = state.playerCoordinates.col;
          break;

        case "Left":
          newRow = state.playerCoordinates.row;
          newCol = state.playerCoordinates.col - 1;
          break;

        default:
          return state;
      }

      const outOfBounds = (newRow < 0 || newCol < 0 || newRow >= MAP_HEIGHT || newCol >= MAP_WIDTH)
      if(outOfBounds)
        return state;

      let newMap = [...state.map]; 
      let newPlayerHealth = state.playerHealth;
      let newWeaponLevel = state.weaponLevel;
      let newPlayerAttack = state.playerAttack;
      let newplayerXPToNextLevel = state.playerXPToNextLevel;
      let newPlayerLevel = state.playerLevel;
      
      switch(state.map[newRow][newCol]) {
        
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
        
        default: //enemy
          let enemyHealth = state.map[newRow][newCol];
          const isBoss = enemyHealth === Block.BOSS;
          enemyHealth -= getRandomInt(state.playerAttack-1, state.playerAttack+1);
          console.log(enemyHealth);
          if(enemyHealth <= ENEMY_ZERO_HEALTH) {
            if(isBoss) {
              alert("You beat the boss. You Won!");
              return getNewMap();
            } else {
              newplayerXPToNextLevel -= 20 * (state.currentDungeon + 1);
              if(newplayerXPToNextLevel <= 0) { //TODO: account for rollover
                newPlayerLevel += 1;
                newPlayerAttack += 10;
                newplayerXPToNextLevel = newPlayerLevel * 60;
              }
            }
          } else {
            newPlayerHealth -= isBoss ? getRandomInt(45,55) : getRandomInt(10*(state.currentDungeon+1)-1, 10*(state.currentDungeon+1)+1);
            if (newPlayerHealth <= 0) {
              alert("You Died!");
              const mapAndPos = generateInitialMapAndPlayerCoordinates();
              return getNewMap();
            }
            newMap[newRow][newCol] = enemyHealth;
            newRow = state.playerCoordinates.row;
            newCol = state.playerCoordinates.col;
          }
          break;
        }
      
      newMap[state.playerCoordinates.row][state.playerCoordinates.col] = Block.EMPTY;
      newMap[newRow][newCol] = Block.PLAYER;
      return {
        ...state,
        map: newMap,
        playerCoordinates: {
          row: newRow,
          col: newCol
        },
        playerHealth: newPlayerHealth,
        weaponLevel: newWeaponLevel,
        playerWeapon: WEAPONS[newWeaponLevel],
        playerAttack: newPlayerAttack,
        playerXPToNextLevel: newplayerXPToNextLevel,
        playerLevel: newPlayerLevel,
      }
    }

    default:
      return state;
  }
}