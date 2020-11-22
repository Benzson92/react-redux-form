import { configureStore } from '@reduxjs/toolkit';

import infoPersonalReducer from '../features/infoPersonal/infoPersonalSlice'

// convert object to string and store in localStorage
export function saveToLocalStorage(state) {
  console.log(state);
  if (typeof window !== 'undefined') {
    try {
      const serialisedState = JSON.stringify(state);
      localStorage.setItem('state', serialisedState);
    } catch (e) {
      console.warn(e);
    }
  }
}

// load string from localStarage and convert back in to an Object
// invalid output must be undefined
function loadFromLocalStorage() {
  if (typeof window !== 'undefined') {
    try {
      const serialisedState = localStorage.getItem('state');
      if (serialisedState === null) return undefined;
      return JSON.parse(serialisedState);
    } catch (e) {
      console.warn(e);
      return undefined;
    }
  }
}
const store = configureStore({
  reducer: {
    infoPersonal: infoPersonalReducer
  },
  preloadedState: loadFromLocalStorage()
});

export default store
