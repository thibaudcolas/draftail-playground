import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import "./ProgressMeter.css";

const getMeterColor = (progress) => {
  let color = "#1da1f2";

  if (progress >= 1) {
    color = "#ff4136";
  } else if (progress >= 0.9) {
    color = "orange";
  }

  return color;
};

/**
 * A radial progress meter, made with SVG stroke-dasharray and stroke-dashoffset.
 */
class ProgressMeter extends PureComponent {
  render() {
    const { radius, progress } = this.props;
    const diameter = radius * 2;
    const circumference = diameter * Math.PI;
    const isFull = progress >= 1;

    return (
      <svg
        height={diameter}
        width={diameter}
        className={`ProgressMeter Draftail-Icon${
          isFull ? " ProgressMeter--pulse" : ""
        }`}
      >
        <circle
          className="ProgressMeter__background"
          cx="50%"
          cy="50%"
          r={radius}
        />
        <circle
          className="ProgressMeter__progressbar"
          cx="50%"
          cy="50%"
          r={radius}
          stroke={getMeterColor(progress)}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: isFull
              ? 0
              : circumference - circumference * progress,
          }}
        />
      </svg>
    );
  }
}

ProgressMeter.propTypes = {
  radius: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
};

export default ProgressMeter;
