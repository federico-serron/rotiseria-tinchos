const backendUrl = import.meta.env.VITE_BACKEND_URL;

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			personas: ["Pedro","Maria"],
			demoMsg: "",
			message: "",
			error: "",
			logged_user: {},
		},
		actions: {

			signup: async (name, email, password, phone, address) => {
				const URLsignup = `${backendUrl}/user/signup`;
				const store = getStore()

				if(!name || !email || !password || !phone){
					setStore({...store, error: "Completa todos los campos."})
					return false;

				}

				try {
					const userData = {
						name: name,
						email: email,
						password: password,
						phone: phone,
						address: address
					}

					const response = await fetch(URLsignup, {
						method: "POST",
						body: JSON.stringify(userData),
						headers: {
							"Content-type": "application/json; charset=UTF-8"
						}
					})

					const data = await response.json()

					if (!response.ok) {
						throw new Error(data.error);
					}


					setStore({...store, message: data.msg, logged_user: data.user})
					return true

				} catch (error) {
					setStore({...store, error: error.message})
					console.error(store.error)
					return false
				}

		},
		}
	};
};

export default getState;