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
const playerStartingRow = MAP_HEIGHT/2;
const playerStartingCol = MAP_WIDTH/2
initialMap[playerStartingRow][playerStartingCol] = 1;
initialMap[playerStartingRow-2][playerStartingCol] = 2;

const initialState = {
  map: initialMap,
  playerHealth: 100,
  playerWeapon: "Hands",
  playerAttack: 3,
  playerLevel: 1,
  playerXPToNextLevel: 60,
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
      let newPlayerHealth = state.playerHealth;
      if (state.map[newRow][newCol] == 2) {
        newPlayerHealth += 20; 
      }
      let newMap = [...state.map];
      newMap[state.playerCoordinates.row][state.playerCoordinates.col] = 0;
      newMap[newRow][newCol] = 1;
      return {
        ...state,
        map: newMap,
        playerCoordinates: {
          row: newRow,
          col: newCol
        },
        playerHealth: newPlayerHealth
      }
    }

    default:
      return state;
  }
}