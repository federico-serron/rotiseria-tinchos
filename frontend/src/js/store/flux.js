const backendUrl = `${import.meta.env.VITE_BACKEND_URL}/api`;

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
			categories: [],
		},
		actions: {

			///////////////////////////////////////////////// AUTHENTICATION /////////////////////////////////////////////////////////////////
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

			///////////////////////////////////////////////// MENU /////////////////////////////////////////////////////////////////
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

					setStore({ ...store, menu: data.menu.filter(m => m.is_available) })
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

					setStore({
						...store, message: data.msg, menu: store.menu.map(m =>
							m.id === id ? data.menu_item : m
						)
					})
					//setStore({ ...store, message: data.msg, menu: [...store.menu, data.menu_item] })
					return true
					return true

				} catch (error) {
					setStore({ ...store, error: error.message })
					console.error(store.error)
					return false
				}

			},

			deleteMenuItem: async (id) => {
				const URLdeleteMenuItem = `${backendUrl}/menu/${id}`;
				const store = getStore()

				try {
					const response = await fetch(URLdeleteMenuItem, {
						method: "DELETE",
						headers: {
							"Authorization": `Bearer ${localStorage.getItem("access_token")}`,
						},
					})

					const data = await response.json()

					if (!response.ok) {
						throw new Error(data.error);
					}

					setStore({ ...store, message: data.msg, menu: store.menu.filter(m => m.id != id) })


					return true

				} catch (error) {
					setStore({ ...store, error: error.message })
					console.error(store.error)
					return false
				}

			},

			///////////////////////////////////////////////// CATEGORIES /////////////////////////////////////////////////////////////////
			getCategories: async () => {
				const URLgetCategories = `${backendUrl}/categories/`;
				const store = getStore()

				try {

					const response = await fetch(URLgetCategories, {
						method: "GET"
					})

					const data = await response.json()

					if (!response.ok) {
						throw new Error(data.error);
					}

					setStore({ ...store, categories: data.categories })
					return true

				} catch (error) {
					setStore({ ...store, error: error.message })
					console.error(store.error)
					return false
				}

			},

			addCategory: async (categoryData) => {
				const URLaddCategory = `${backendUrl}/categories/`;
				const store = getStore();

				if (!categoryData.name || !categoryData.note) {
					throw new Error("Todos los campos son obligatorios");
				}

				try {
					const response = await fetch(URLaddCategory, {
						method: "POST",
						headers: {
							"Authorization": `Bearer ${localStorage.getItem("access_token")}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify(categoryData)
					});

					const data = await response.json();

					if (!response.ok) {
						throw new Error(data.error || "Error desconocido");
					}

					setStore({
						...store,
						message: data.msg,
						categories: [...store.categories, data.category]
					});

					return true;

				} catch (error) {
					setStore({ ...store, error: error.message });
					console.log("error: ", error)
					return false;
				}
			},

			editCategory: async (id, categoryData) => {
				const URLeditCategory = `${backendUrl}/categories/${id}`;
				const store = getStore()

				try {

					const response = await fetch(URLeditCategory, {
						method: "PUT",
						headers: {
							"Authorization": `Bearer ${localStorage.getItem("access_token")}`,
							"Content-Type": "application/json"
						},
						body: JSON.stringify(categoryData)
					})

					const data = await response.json()

					if (!response.ok) {
						throw new Error(data.error);
					}
					if (!data.category) {
						throw new Error(data.error);
					}

					setStore({
						...store, message: data.msg, categories: store.categories.map(c =>
							c.id === id ? data.category : c
						)
					})
					return true

				} catch (error) {
					setStore({ ...store, error: error.message })
					console.log("soy el error")
					console.error(store.error)
					return false
				}

			},

			deleteCategory: async (id) => {
				const URLdeleteCategory = `${backendUrl}/categories/${id}`;
				const store = getStore()

				try {
					const response = await fetch(URLdeleteCategory, {
						method: "DELETE",
						headers: {
							"Authorization": `Bearer ${localStorage.getItem("access_token")}`,
						},
					})

					const data = await response.json()

					if (!response.ok) {
						throw new Error(data.error);
					}

					setStore({ ...store, message: data.msg, categories: store.categories.filter(c => c.id != id) })


					return true

				} catch (error) {
					setStore({ ...store, error: error.message })
					console.error(store.error)
					return false
				}

			},

			///////////////////////////////////////////////// INVOINCES /////////////////////////////////////////////////////////////////
		}
	};
};

export default getState;