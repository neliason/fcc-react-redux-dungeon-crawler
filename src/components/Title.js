import React from 'react';
import PropTypes from 'prop-types';

const Title = props => {
  return (
    <div className="title">
      {props.title}
    </div>
  );
};

Title.propTypes = {
  title: PropTypes.string.isRequired
};

export default Title;