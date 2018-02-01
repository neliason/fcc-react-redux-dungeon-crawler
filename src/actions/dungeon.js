import * as DungeonActionTypes from '../actiontypes/dungeon';

export const move = (direction) => {
  return {
    type: DungeonActionTypes.MOVE,
    direction
  }
}

export const toggleLights = () => {
  return {
    type: DungeonActionTypes.TOGGLE_LIGHTS
  };
};