import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as DungeonActionCreators from '../actions/dungeon';
import '../App.css';
import StatsPanel from '../components/StatsPanel';
import Title from '../components/Title';

const SIGHT_RANGE = 4;

class App extends Component {

  static propTypes = {
    playerHealth: PropTypes.number.isRequired,
    playerWeapon: PropTypes.string.isRequired,
    playerAttack: PropTypes.number.isRequired,
    playerXPToNextLevel: PropTypes.number.isRequired,
    currentDungeon: PropTypes.number.isRequired,
    playerLevel: PropTypes.number.isRequired
  };

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  handleKeyPress = (event) => {
    if(event.key.includes("Arrow")) {
      event.preventDefault();
      this.props.move(event.key.replace("Arrow",""));
    }
  }

  render() {
    return (
      <div className="App">
        <Title 
          title="Dungeon Crawler"
        />
        <StatsPanel 
          playerHealth={this.props.playerHealth}
          playerWeapon={this.props.playerWeapon}
          playerAttack={this.props.playerAttack}
          playerXPToNextLevel={this.props.playerXPToNextLevel}
          currentDungeon={this.props.currentDungeon}
          playerLevel={this.props.playerLevel}
        />
        <div className="map">
          {this.props.map.map((row, rowIndex) => {
            return(
              <div key={rowIndex} className="map-row">
                {row.map((block, colIndex) => {
                  return(
                    <span>
                      {
                        (
                          rowIndex < this.props.playerCoordinates.row - SIGHT_RANGE 
                          || rowIndex > this.props.playerCoordinates.row + SIGHT_RANGE 
                          || colIndex < this.props.playerCoordinates.col - SIGHT_RANGE 
                          || colIndex > this.props.playerCoordinates.col + SIGHT_RANGE
                        )
                          ? <span className={`block block-value-${block}`} key={colIndex} />
                          : <span className={`block block-value-${block}`} key={colIndex} />
                      }
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    map: state.map,
    playerHealth: state.playerHealth,
    playerWeapon: state.playerWeapon,
    playerAttack: state.playerAttack,
    playerXPToNextLevel: state.playerXPToNextLevel,
    currentDungeon: state.currentDungeon,
    playerLevel: state.playerLevel,
    playerCoordinates: state.playerCoordinates
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    attack: () => {
      dispatch(DungeonActionCreators.attack())
    },
    move: (direction) => {
      dispatch(DungeonActionCreators.move(direction))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
