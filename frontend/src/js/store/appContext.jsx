import React, { useState, useEffect, useRef } from "react";
import getState from "./flux.js";


export const Context = React.createContext(null);

const injectContext = PassedComponent => {
	const StoreWrapper = props => {
		const storeRef = useRef(null);
		const actionsRef = useRef(null);

		//this will be passed as the context value
		const [state, setState] = useState(() => {
			const initialState = getState({
				getStore: () => storeRef.current,
				getActions: () => actionsRef.current,
				setStore: updatedStore =>
					setState(prevState => {
						const newStore = { ...prevState.store, ...updatedStore };
						storeRef.current = newStore;
						return {
							store: newStore,
							actions: prevState.actions
						};
					})
			});
			storeRef.current = initialState.store;
			actionsRef.current = initialState.actions;
			return initialState;
		});

		useEffect(() => {
			state.actions.loadCartFromStorage();
		}, []);


		return (
			<Context.Provider value={state}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};
	return StoreWrapper;
};

export default injectContext;
