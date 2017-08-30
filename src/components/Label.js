import React from 'react';
import './style/Label.css';
import CN from 'classnames';

function Label(props) {
  return (
    <label className={CN("input-label", props.className)} htmlFor={props.htmlFor}>
      {props.children}
    </label>
  );
}

export default Label;
