import React from "react";
import PropTypes from "prop-types";

const StatsPanel = props =>
  <div className="stats-panel row">
    <div className="col-xs-3">
      Health: {props.playerHealth}
    </div>
    <div className="col-xs-2">
      Weapon: {props.playerWeapon}
    </div>
    <div className="col-xs-2">
      Attack: {props.playerAttack}
    </div>
    <div className="col-xs-2">
      Level: {props.playerLevel}
    </div>
    <div className="col-xs-3">
      Next Level: {props.playerXPToNextLevel} XP
    </div>
  </div>

StatsPanel.proptypes = {
  playerHealth: PropTypes.number.isRequired,
  playerWeapon: PropTypes.string.isRequired,
  playerAttack: PropTypes.number.isRequired,
  playerXPToNextLevel: PropTypes.number.isRequired,
  currentDungeon: PropTypes.number.isRequired,
  playerLevel: PropTypes.number.isRequired
}

export default StatsPanel;