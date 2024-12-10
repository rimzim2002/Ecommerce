import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from './reducer';

const Theme = () => {
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  return (
    <>
      <div>Current Theme: {mode}</div>
      <button onClick={() => dispatch(toggleTheme())}>Toggle Theme</button>
    </>
  );
};

export default Theme;
