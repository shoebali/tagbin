import { Actions } from "../Actions/Actions";

const checkExpiration = (storedAuthState) => {
  const currentTime = new Date().getTime();
  const storedTime = storedAuthState ? storedAuthState.timestamp : 0;
  const oneHourInMilliseconds = 60 * 60 * 1000;

  return currentTime - storedTime < oneHourInMilliseconds;
};
const storedAuthState = JSON.parse(localStorage.getItem("authState"));

const initialState = {
  isAuthenticated: storedAuthState ? checkExpiration(storedAuthState) ? storedAuthState.isAuthenticated : false : false,
  token: storedAuthState ? checkExpiration(storedAuthState) ? storedAuthState.token : "" : "",
  tokenExpiry: storedAuthState ? checkExpiration(storedAuthState) ? storedAuthState.tokenExpiry : "" : "",
  user: storedAuthState ? checkExpiration(storedAuthState) ? storedAuthState.user : {} : {},
};

export default function authenticationReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.USERLOGIN:
      const userAuthState = {
        isAuthenticated: true,
        user: action.data.user,
        token: action.data.token,
        tokenExpiry: action.data.tokenExpiry,
      };

      localStorage.setItem("authState", JSON.stringify(userAuthState));

      return {
        ...state,
        ...userAuthState,
      };

    case Actions.LOGOUT:
      localStorage.removeItem("authState");

      return {
        ...state,
        isAuthenticated: false,
        user: {},
        token: "",
        tokenExpiry: "",
      };

    default:
      return state;
  }
}
