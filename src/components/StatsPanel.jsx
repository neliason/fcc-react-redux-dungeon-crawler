import React from 'react';
import PropTypes from 'prop-types';

const StatsPanel = props => (
  <div className="stats-panel">
    <div>
      Health: {props.playerHealth}
    </div>
    <div>
      Weapon: {props.playerWeapon}
    </div>
    <div>
      Attack: {props.playerAttack}
    </div>
    <div>
      Level: {props.playerLevel}
    </div>
    <div>
      Next Level: {props.playerXPToNextLevel} XP
    </div>
    <div>
      Dungeon: {props.currentDungeon}
    </div>
    <button className="light-btn btn btn-default" onClick={props.toggleLights}>
      Toggle Lights
    </button>
  </div>
);

StatsPanel.propTypes = {
  playerHealth: PropTypes.number.isRequired,
  playerWeapon: PropTypes.string.isRequired,
  playerAttack: PropTypes.number.isRequired,
  playerXPToNextLevel: PropTypes.number.isRequired,
  currentDungeon: PropTypes.number.isRequired,
  playerLevel: PropTypes.number.isRequired,
  toggleLights: PropTypes.func.isRequired,
};

export default StatsPanel;
