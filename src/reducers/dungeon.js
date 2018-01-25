import * as DungeonActionTypes from '../actiontypes/dungeon';

const MAP_WIDTH = 50;
const MAP_HEIGHT = 30;
let initialMap = new Array(MAP_HEIGHT);
for (let i = 0; i < MAP_HEIGHT; i++) {
  initialMap[i] = new Array(MAP_WIDTH);
  for (let j = 0; j < MAP_WIDTH; j++) {
    initialMap[i][j] = 0;
  }
}

const enemy = {
  health: 20
}

const playerStartingRow = MAP_HEIGHT/2;
const playerStartingCol = MAP_WIDTH/2;
initialMap[playerStartingRow][playerStartingCol] = 1;
initialMap[playerStartingRow-2][playerStartingCol] = 2;
initialMap[playerStartingRow+2][playerStartingCol] = 3;
initialMap[playerStartingRow][playerStartingCol-2] = 40;

const ENEMY_ZERO_HEALTH = 3;

const weapons = {
  0: "Hands",
  1: "Knife",
  2: "Mace",
  3: "Sword",
  4: "Battle Axe"
}

const initialState = {
  map: initialMap,
  playerHealth: 100,
  weaponLevel: 0,
  playerWeapon: weapons[0],
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

      let newMap = [...state.map];
      let newPlayerHealth = state.playerHealth;
      let newWeaponLevel = state.weaponLevel;
      let newPlayerAttack = state.playerAttack;
      let newplayerXPToNextLevel = state.playerXPToNextLevel;
      let newPlayerLevel = state.playerLevel;
      switch(state.map[newRow][newCol]) {
        
        case 0:
          break;

        case 2:
          newPlayerHealth += 20;
          break;

        case 3:
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
        playerWeapon: weapons[newWeaponLevel],
        playerAttack: newPlayerAttack,
        playerXPToNextLevel: newplayerXPToNextLevel,
      }
    }

    default:
      return state;
  }
}