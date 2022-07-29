import React from 'react';

// hooks for useboolean
export const useBoolean = (initialValue = false) => {
  const [value, setValue] = React.useState(initialValue);
  const toggleValue = () => setValue(!value);
  const setValueToTrue = () => setValue(true);
  const setValueToFalse = () => setValue(false);

  return [value, setValueToTrue, setValueToFalse, toggleValue];
};
