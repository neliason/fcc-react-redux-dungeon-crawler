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
initialMap[MAP_HEIGHT/2][MAP_WIDTH/2] = 1;

const initialState = {
  map: initialMap,
  playerHealth: 100,
  playerWeapon: "Hands",
  playerAttack: 3,
  playerLevel: 1,
  playerXPToNextLevel: 60,
  playerCoordinates: {
    x: MAP_HEIGHT/2,
    y: MAP_WIDTH/2
  },
  currentDungeon: 0
}

export default function Dungeon(state=initialState, action) {
  switch(action.type) {
    case DungeonActionTypes.ATTACK: {
      return state;
    }

    case DungeonActionTypes.MOVE: {
      
      let newX;
      let newY;
      switch(action.direction) {
        case "Up":
          newX = state.playerCoordinates.x - 1;
          newY = state.playerCoordinates.y;
          break;

        case "Right":
          newX = state.playerCoordinates.x;
          newY = state.playerCoordinates.y + 1;
          break;

        case "Down":
          newX = state.playerCoordinates.x + 1;
          newY = state.playerCoordinates.y;
          break;

        case "Left":
          newX = state.playerCoordinates.x;
          newY = state.playerCoordinates.y - 1;
          break;
          
        default:
          return state;
      }
      let newMap = [...state.map];
      newMap[state.playerCoordinates.x][state.playerCoordinates.y] = 0;
      newMap[newX][newY] = 1;
      return {
        ...state,
        map: newMap,
        playerCoordinates: {
          x: newX,
          y: newY
        }
      }
    }

    default:
      return state;
  }
}