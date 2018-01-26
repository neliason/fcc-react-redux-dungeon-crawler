import * as DungeonActionTypes from '../actiontypes/dungeon';

const MAP_WIDTH = 50;
const MAP_HEIGHT = 30;
const ENEMY_ZERO_HEALTH = 3;
const PLAYER_STARTING_ROW = MAP_HEIGHT/2;
const PLAYER_STARTING_COL = MAP_WIDTH/2;
const NUM_ENEMIES = 4;

const Block = {
  EMPTY: 0,
  PLAYER: 1,
  HEALTH: 2,
  WEAPON: 3,
  WALL: 2000,
  ENEMY_LVL_1: 40
}

const WEAPONS = {
  0: "Hands",
  1: "Knife",
  2: "Mace",
  3: "Sword",
  4: "Battle Axe"
}

var playerStartingCol = 0;
var playerStartingRow = 0;
function generateInitialMap() {
  let initialMap = new Array(MAP_HEIGHT);
  for (let i = 0; i < MAP_HEIGHT; i++) {
    initialMap[i] = new Array(MAP_WIDTH);
    for (let j = 0; j < MAP_WIDTH; j++) {
      initialMap[i][j] = 0;
    }
  }
  initialMap[0][0] = Block.WALL;

  //while(initialMap[playerStartingRow][playerStartingCol] !== Block.EMPTY) {
    playerStartingRow = Math.floor(Math.random() * Math.floor(MAP_HEIGHT));
    playerStartingCol = Math.floor(Math.random() * Math.floor(MAP_WIDTH));
    initialMap[playerStartingRow][playerStartingCol] = Block.PLAYER;
  //}

  randomPlaceBlock(initialMap, Block.HEALTH);
  randomPlaceBlock(initialMap, Block.WEAPON);
  for(let i = 0; i < NUM_ENEMIES; i++) {
    randomPlaceBlock(initialMap, Block.ENEMY_LVL_1);
  }
  return initialMap;
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
}

const initialState = {
  map: generateInitialMap(),
  playerHealth: 25,
  weaponLevel: 0,
  playerWeapon: WEAPONS[0],
  playerAttack: 3,
  playerLevel: 1,
  playerXPToNextLevel: 20,
  playerCoordinates: {
    row: playerStartingRow,
    col: playerStartingCol
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
          enemyHealth -= state.playerAttack;
          if(enemyHealth <= ENEMY_ZERO_HEALTH) {
            newplayerXPToNextLevel -= 20 * (state.currentDungeon + 1);
            if(newplayerXPToNextLevel <= 0) {
              newPlayerLevel += 1;
              newPlayerAttack += 10;
              newplayerXPToNextLevel = newPlayerLevel * 60;
            }
          } else {
            newPlayerHealth -= 10 * (state.currentDungeon + 1);
            if (newPlayerHealth <= 0) {
              return {
                ...initialState,
                map: generateInitialMap()
              }
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
      }
    }

    default:
      return state;
  }
}