import * as DungeonActionTypes from '../actiontypes/dungeon';

export const move = (direction) => {
  return {
    type: DungeonActionTypes.MOVE,
    direction
  }
}

export const attack = () => {
  return {
    type: DungeonActionTypes.ATTACK
  };
};