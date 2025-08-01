const backendUrl = import.meta.env.VITE_BACKEND_URL;

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			personas: ["Pedro", "Maria"],
			demoMsg: "",
			message: "",
			error: "",
			logged_user: {},
			users: [
				{
					"id": 1,
					"name": "Juan Pérez",
					"email": "juan.perez@example.com",
					"phone": "+598 123456789",
					"lastLogin": "2025-07-25 14:30",
					"premium": true
				},
				{
					"id": 2,
					"name": "Ana Gómez",
					"email": "ana.gomez@example.com",
					"phone": "+598 987654321",
					"lastLogin": "2025-07-24 10:15",
					"premium": false
				},
				{
					"id": 3,
					"name": "Carlos López",
					"email": "carlos.lopez@example.com",
					"phone": "+598 456789123",
					"lastLogin": "2025-07-23 18:45",
					"premium": true
				},
				{
					"id": 4,
					"name": "María Fernández",
					"email": "maria.fernandez@example.com",
					"phone": "+598 654321987",
					"lastLogin": "2025-07-22 09:00",
					"premium": false
				},
				{
					"id": 5,
					"name": "Pedro Sánchez",
					"email": "pedro.sanchez@example.com",
					"phone": "+598 321654987",
					"lastLogin": "2025-07-21 16:20",
					"premium": true
				}
			],
			menu: [],
		},
		actions: {

			signup: async (name, email, password, phone, address) => {
				const URLsignup = `${backendUrl}/user/signup`;
				const store = getStore()

				if (!name || !email || !password || !phone) {
					setStore({ ...store, error: "Completa todos los campos." })
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

					setStore({ ...store, message: data.msg })
					return true

				} catch (error) {
					setStore({ ...store, error: error.message })
					console.error(store.error)
					return false
				}

			},


			login: async (email, password) => {
				const URLlogin = `${backendUrl}/user/login`;
				const store = getStore()

				if (!email || !password) {
					setStore({ ...store, error: "Completa todos los campos." })
					return false;

				}

				try {
					const userData = {
						email: email,
						password: password
					}

					const response = await fetch(URLlogin, {
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
					if (!data.access_token) {
						throw new Error(data.error);
					}

					localStorage.setItem("access_token", data.access_token)

					setStore({ ...store, message: data.msg })
					return true

				} catch (error) {
					setStore({ ...store, error: error.message })
					console.error(store.error)
					return false
				}

			},

			logout: async () => {
				const URLlogout = `${backendUrl}/user/logout`;
				const store = getStore();
				const token = localStorage.getItem("access_token")

				if (!token) {
					setStore({ ...store, error: "Debes loguearte antes de desloguearte!" })
					return false
				}

				try {

					const response = await fetch(URLlogout, {
						method: "POST",
						headers: {
							"Authorization": `Bearer ${localStorage.getItem('access_token')}`,
							"Content-type": "application/json; charset=UTF-8"
						}
					})

					const data = await response.json()

					if (!response.ok) {
						throw new Error(data.error);
					}

					localStorage.removeItem("access_token")
					setStore({ ...store, logged_user: {} })

					return true;

				} catch (error) {
					setStore({ ...store, error: error.message })
					return false;
				}
			},

			getMenuItems: async () => {
				const URLgetMenuItems = `${backendUrl}/menu/`;
				const store = getStore()

				try {

					const response = await fetch(URLgetMenuItems, {
						method: "GET"
					})

					const data = await response.json()

					if (!response.ok) {
						throw new Error(data.error);
					}

					setStore({ ...store, menu: data.menu })
					return true

				} catch (error) {
					setStore({ ...store, error: error.message })
					console.error(store.error)
					return false
				}

			},

			addMenuItem: async (formData) => {
				const URLAddMenuItem = `${backendUrl}/menu/`;
				const store = getStore();

				try {
					const response = await fetch(URLAddMenuItem, {
						method: "POST",
						headers: {
							"Authorization": `Bearer ${localStorage.getItem("access_token")}`,
							// NO pongas Content-Type acá
						},
						body: formData // esto tiene que ir crudo, sin stringify
					});

					const data = await response.json();

					if (!response.ok) {
						throw new Error(data.error || "Error desconocido");
					}

					if (!data.menu_item) {
						throw new Error("Faltan datos del menú");
					}

					setStore({
						...store,
						message: data.msg,
						menu: [...store.menu, data.menu_item]
					});

					return true;

				} catch (error) {
					setStore({ ...store, error: error.message });
					console.error("Error al agregar ítem del menú:", error.message);
					return false;
				}
			},


			editMenuItem: async (id, formData) => {
				const URLeditMenuItem = `${backendUrl}/menu/${id}`;
				const store = getStore()

				try {
					const jsonData = Object.fromEntries(formData.entries());
					const response = await fetch(URLeditMenuItem, {
						method: "PUT",
						headers: {
							"Authorization": `Bearer ${localStorage.getItem("access_token")}`,
							"Content-Type": "application/json"
						},
						body: JSON.stringify(jsonData)
					})

					const data = await response.json()

					if (!response.ok) {
						throw new Error(data.error);
					}
					if (!data.menu_item) {
						throw new Error(data.error);
					}

					setStore({ ...store, message: data.msg, menu: [...store.menu, data.menu_item] })
					return true

				} catch (error) {
					setStore({ ...store, error: error.message })
					console.error(store.error)
					return false
				}

			},
		}
	};
};

export default getState;