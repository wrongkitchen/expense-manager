import React, { useReducer } from 'react'

let reducer = (state, action) => {
    switch (action.type) {
      case "increment":
        return { ...state };
      case "decrement":
        return { ...state };
      default:
        return;
    }
};

const initialState = { name: "hello world" };
const GlobalContext = React.createContext(initialState);

function GlobalProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {props.children}
        </GlobalContext.Provider>
    );
}
export { GlobalContext, GlobalProvider };