import * as DungeonActionTypes from '../actiontypes/dungeon';

export const move = direction => ({
  type: DungeonActionTypes.MOVE,
  direction,
});

export const toggleLights = () => ({
  type: DungeonActionTypes.TOGGLE_LIGHTS,
});
