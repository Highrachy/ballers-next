import * as React from 'react';
import PropTypes from 'prop-types';
import { INITIAL_STATE } from './initialStates';
import { isDevEnvironment } from 'utils/helpers';

// CONTEXT
let UserContext = React.createContext();

// REDUCERS
let reducer = (state, action) => {
  if (isDevEnvironment()) {
    console.info('%c[USER CONTEXT STATE] state', 'color: blue', state);
    console.info('%c[USER CONTEXT ACTION] action', 'color: green', action);
  }
  switch (action.type) {
    case 'no-token':
    case 'user-logout':
      return INITIAL_STATE;
    case 'user-info':
    case 'user-login':
    case 'user-social-media-login':
    case 'user-profile-update':
      return { ...state, ...action.user, isLoggedIn: true };
    case 'read-all-notifcations':
      return { ...state, ...action.user, notifications: [] };
    case 'user-profile-image':
      return { ...state, profileImage: action.profileImage };
    case 'available-options':
      return { ...state, availableOptions: action.availableOptions };
    case 'remove-favorite':
      const favorites = state.favorites.filter(
        (favorite) => action.property._id !== favorite._id
      );
      return { ...state, favorites };
    case 'add-to-favorites':
      return {
        ...state,
        favorites: [action.property, ...state.favorites],
      };
    case 'remove-alert':
      return { ...state, alert: null };
    case 'add-alert':
      return { ...state, alert: action.alert };
    default:
      return state;
  }
};

// PROVIDER
let UserContextProvider = (props) => {
  let [userState, userDispatch] = React.useReducer(reducer, INITIAL_STATE);
  let value = { userState, userDispatch };

  window.userState = value.userState;
  window.userDispatch = value.userDispatch;

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};

UserContextProvider.propTypes = {
  children: PropTypes.any.isRequired,
};

// CONSUMER - ONLY USEFUL IN CLASSES
let UserContextConsumer = UserContext.Consumer;

// using in a function
// let updateUser = name => () => userDispatch({ type: 'save-user', name });
// <button className="btn btn-primary" onClick={updateUser('Oladayo')}></button>;

export { UserContext, UserContextProvider, UserContextConsumer };
