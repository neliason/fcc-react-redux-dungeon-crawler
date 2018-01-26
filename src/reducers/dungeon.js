import * as DungeonActionTypes from '../actiontypes/dungeon';

const MAP_WIDTH = 50;
const MAP_HEIGHT = 30;
const ENEMY_ZERO_HEALTH = 3;
const PLAYER_STARTING_ROW = MAP_HEIGHT/2;
const PLAYER_STARTING_COL = MAP_WIDTH/2;

const BLOCK = {
  empty: 0,
  player: 1,
  health: 2,
  weapon: 3
}

const WEAPONS = {
  0: "Hands",
  1: "Knife",
  2: "Mace",
  3: "Sword",
  4: "Battle Axe"
}

function generateInitialMap() {
  let initialMap = new Array(MAP_HEIGHT);
  for (let i = 0; i < MAP_HEIGHT; i++) {
    initialMap[i] = new Array(MAP_WIDTH);
    for (let j = 0; j < MAP_WIDTH; j++) {
      initialMap[i][j] = 0;
    }
  }
  initialMap[PLAYER_STARTING_ROW][PLAYER_STARTING_COL] = BLOCK.player;
  initialMap[PLAYER_STARTING_ROW-2][PLAYER_STARTING_COL] = BLOCK.health;
  initialMap[PLAYER_STARTING_ROW+2][PLAYER_STARTING_COL] = BLOCK.weapon;
  initialMap[PLAYER_STARTING_ROW][PLAYER_STARTING_COL-2] = 40;
  initialMap[PLAYER_STARTING_ROW][PLAYER_STARTING_COL+2] = 40;
  return initialMap;
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
    row: PLAYER_STARTING_ROW,
    col: PLAYER_STARTING_COL
  },
  currentDungeon: 0
}
Object.freeze(initialState);

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

      let newMap = [...state.map];
      let newPlayerHealth = state.playerHealth;
      let newWeaponLevel = state.weaponLevel;
      let newPlayerAttack = state.playerAttack;
      let newplayerXPToNextLevel = state.playerXPToNextLevel;
      let newPlayerLevel = state.playerLevel;
      
      switch(state.map[newRow][newCol]) {
        
        case BLOCK.empty:
          break;

        case BLOCK.health:
          newPlayerHealth += 20;
          break;

        case BLOCK.weapon:
          newWeaponLevel += newWeaponLevel < 5 ? 1 : 0;
          newPlayerAttack += 7;
          break;
        
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
      
      newMap[state.playerCoordinates.row][state.playerCoordinates.col] = 0;
      newMap[newRow][newCol] = 1;
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