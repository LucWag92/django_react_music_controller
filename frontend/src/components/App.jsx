import React from 'react';
import { render } from 'react-dom';
import HomePage from './HomePage';

export const App = (props) => {
  const { name } = props;
  return (
    <div className="center">
      <HomePage />
    </div>
  );
};
const appDiv = document.getElementById('app');
render(<App name="Lucas" />, appDiv);
