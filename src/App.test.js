import * as Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './containers/App';
import * as DungeonActionCreators from './actions/dungeon';
import * as DungeonActionTypes from './actiontypes/dungeon';
import reducer from './reducers/dungeon';

Enzyme.configure({ adapter: new Adapter() });

describe('dungeon reducer', () => {
  let mockStateBlankMap;
  let mockStateFilledMap;

  beforeEach(() => {
    mockStateBlankMap = {
      playerHealth: 100,
      weaponLevel: 0,
      playerWeapon: 'Hands',
      playerAttack: 3,
      playerLevel: 1,
      playerXPToNextLevel: 20,
      currentDungeon: 0,
      lightsOn: true,
      bossHealth: 400,
      playerCoordinates: {
        row: 1,
        col: 1,
      },
      map: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ],
    };
    mockStateFilledMap = {
      playerHealth: 100,
      weaponLevel: 0,
      playerWeapon: 'Hands',
      playerAttack: 3,
      playerLevel: 1,
      playerXPToNextLevel: 20,
      currentDungeon: 0,
      lightsOn: true,
      bossHealth: 400,
      playerCoordinates: {
        row: 1,
        col: 1,
      },
      map: [
        [0, 3, 0],
        [2, 1, 5],
        [0, 30, 0],
      ],
    };
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      playerHealth: 100,
      weaponLevel: 0,
      playerWeapon: 'Hands',
      playerAttack: 3,
      playerLevel: 1,
      playerXPToNextLevel: 20,
      currentDungeon: 0,
      lightsOn: true,
      bossHealth: 400,
      playerCoordinates: {
        row: expect.any(Number),
        col: expect.any(Number),
      },
      map: expect.arrayContaining([expect.arrayContaining([1]), expect.arrayContaining([2]), expect.arrayContaining([3]), expect.arrayContaining([5]), expect.arrayContaining([30])]),
    });
  });

  it('should handle MOVE right', () => {
    expect(reducer(mockStateBlankMap, {
      type: DungeonActionTypes.MOVE,
      direction: 'Right',
    })).toEqual({
      ...mockStateBlankMap,
      playerCoordinates: {
        row: 1,
        col: 2,
      },
      map: [
        [0, 0, 0],
        [0, 0, 1],
        [0, 0, 0],
      ],
    });
  });

  it('should handle MOVE left', () => {
    expect(reducer(mockStateBlankMap, {
      type: DungeonActionTypes.MOVE,
      direction: 'Left',
    })).toEqual({
      ...mockStateBlankMap,
      playerCoordinates: {
        row: 1,
        col: 0,
      },
      map: [
        [0, 0, 0],
        [1, 0, 0],
        [0, 0, 0],
      ],
    });
  });

  it('should handle MOVE up', () => {
    expect(reducer(mockStateBlankMap, {
      type: DungeonActionTypes.MOVE,
      direction: 'Up',
    })).toEqual({
      ...mockStateBlankMap,
      playerCoordinates: {
        row: 0,
        col: 1,
      },
      map: [
        [0, 1, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
    });
  });

  it('should handle MOVE down', () => {
    expect(reducer(mockStateBlankMap, {
      type: DungeonActionTypes.MOVE,
      direction: 'Down',
    })).toEqual({
      ...mockStateBlankMap,
      playerCoordinates: {
        row: 2,
        col: 1,
      },
      map: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 1, 0],
      ],
    });
  });

  it('should pick up health', () => {
    expect(reducer(mockStateFilledMap, {
      type: DungeonActionTypes.MOVE,
      direction: 'Left',
    })).toEqual({
      ...mockStateFilledMap,
      playerCoordinates: {
        row: 1,
        col: 0,
      },
      map: [
        [0, 3, 0],
        [1, 0, 5],
        [0, 30, 0],
      ],
      playerHealth: 120,
    });
  });

  it('should pick up weapon', () => {
    expect(reducer(mockStateFilledMap, {
      type: DungeonActionTypes.MOVE,
      direction: 'Up',
    })).toEqual({
      ...mockStateFilledMap,
      playerCoordinates: {
        row: 0,
        col: 1,
      },
      map: [
        [0, 1, 0],
        [2, 0, 5],
        [0, 30, 0],
      ],
      playerWeapon: 'Knife',
      weaponLevel: 1,
      playerAttack: 10,
    });
  });

  it('should progress to next dungeon', () => {
    expect(reducer(mockStateFilledMap, {
      type: DungeonActionTypes.MOVE,
      direction: 'Right',
    })).toEqual({
      ...mockStateFilledMap,
      playerCoordinates: {
        row: expect.any(Number),
        col: expect.any(Number),
      },
      currentDungeon: 1,
      map: expect.arrayContaining([expect.arrayContaining([1]), expect.arrayContaining([2]), expect.arrayContaining([3]), expect.arrayContaining([5]), expect.arrayContaining([60])]),
    });
  });

  it('should damage enemy', () => {
    const damageEnemyMove = reducer(mockStateFilledMap, {
      type: DungeonActionTypes.MOVE,
      direction: 'Down',
    });
    expect(damageEnemyMove.map[2][1]).toBeLessThanOrEqual(28);
    expect(damageEnemyMove.map[2][1]).toBeGreaterThanOrEqual(26);
    expect(damageEnemyMove.playerHealth).toBeLessThanOrEqual(91);
    expect(damageEnemyMove.playerHealth).toBeGreaterThanOrEqual(89);
    expect(damageEnemyMove).toEqual({
      ...mockStateFilledMap,
      playerHealth: expect.any(Number),
      map: [
        [0, 3, 0],
        [2, 1, 5],
        [0, expect.any(Number), 0],
      ],
    });
  });
});

describe('actions', () => {
  it('should create an action to move left', () => {
    const direction = 'Left';
    const expectedAction = {
      type: DungeonActionTypes.MOVE,
      direction,
    };
    expect(DungeonActionCreators.move(direction)).toEqual(expectedAction);
  });

  it('should create an action to move up', () => {
    const direction = 'Up';
    const expectedAction = {
      type: DungeonActionTypes.MOVE,
      direction,
    };
    expect(DungeonActionCreators.move(direction)).toEqual(expectedAction);
  });

  it('should create an action to move right', () => {
    const direction = 'Right';
    const expectedAction = {
      type: DungeonActionTypes.MOVE,
      direction,
    };
    expect(DungeonActionCreators.move(direction)).toEqual(expectedAction);
  });

  it('should create an action to move down', () => {
    const direction = 'Down';
    const expectedAction = {
      type: DungeonActionTypes.MOVE,
      direction,
    };
    expect(DungeonActionCreators.move(direction)).toEqual(expectedAction);
  });

  it('should create an action to toggle lights', () => {
    const expectedAction = {
      type: DungeonActionTypes.TOGGLE_LIGHTS,
    };
    expect(DungeonActionCreators.toggleLights()).toEqual(expectedAction);
  });
});

describe('App Component', () => {
  let wrapper;
  const mockMovefn = jest.fn();
  const mockToggleLightsfn = jest.fn();
  const mockMap = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ];
  const mockHealth = 100;
  const mockWeapon = 'hands';
  const mockAttack = 3;
  const mockXP = 80;
  const mockDungeon = 0;
  const mockLevel = 1;
  const mockCoordinates = {
    row: 1,
    col: 1,
  };

  beforeEach(() => {
    wrapper = Enzyme.shallow(<App move={mockMovefn} toggleLights={mockToggleLightsfn} map={mockMap} playerHealth={mockHealth} playerWeapon={mockWeapon} playerAttack={mockAttack} playerXPToNextLevel={mockXP} currentDungeon={mockDungeon} playerLevel={mockLevel} playerCoordinates={mockCoordinates} />);
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(wrapper, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
