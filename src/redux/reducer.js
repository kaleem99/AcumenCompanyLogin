const defaultState = { section: "Home", users: [], session: [] };
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case "Home":
      return { ...state, section: action.type };
    case "Account":
      return { ...state, section: action.type };
    case "GET_USERS":
      return { ...state, users: action.payload };
    case "SESSION_DATA":
      return { ...state, session: action.payload };
    default:
      return { ...state };
  }
};

export default reducer;
