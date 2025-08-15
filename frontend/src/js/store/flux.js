const backendUrl = `${import.meta.env.VITE_BACKEND_URL}/api`;

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			personas: ["Pedro", "Maria"],
			demoMsg: "",
			message: "",
			error: "",
			logged_user: {},
			user_loaded: false,
			users: [],
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

			getCurrentUser: async (force = false) => {
				const store = getStore();
				// If already loaded and not forcing, skip fetch
				if (store.user_loaded && !force) return;

				try {
					const resp = await fetch(`${backendUrl}/auth/me`, {
						method: "GET",
						headers: { "Content-type": "application/json; charset=UTF-8" },
						credentials: "include"
					});
					if (!resp.ok) throw new Error(resp.statusText);
					const data = await resp.json();
					setStore({ ...store, logged_user: data, user_loaded: true });
					return data;
				} catch (error) {
					console.log(error.message);
					setStore({ ...store, logged_user: {}, user_loaded: true });
					return null;
				}
			},


			login: async (email, password) => {
				const URLlogin = `${backendUrl}/auth/login`;
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
							"Content-type": "application/json"
						},
						credentials: "include"
					})

					const data = await response.json()

					if (!response.ok) {
						throw new Error(data.error);
					}

					setStore({ ...store, message: data.msg })
					await getActions().getCurrentUser()
					return true

				} catch (error) {
					setStore({ ...store, error: error.message })
					console.error(store.error)
					return false
				}

			},

			logout: async () => {
				const URLlogout = `${backendUrl}/auth/logout`;
				const store = getStore();

				try {

					const response = await fetch(URLlogout, {
						method: "POST",
						headers: {
							"Content-type": "application/json"
						},
						credentials: "include"
					})

					const data = await response.json()

					if (!response.ok) {
						throw new Error(data.error);
					}

					setStore({ ...store, logged_user: {}, user_loaded: true })

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

						credentials: "include",
						body: formData
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
							"Content-Type": "application/json"
						},
						credentials: "include",
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
							"Content-type": "application/json"
						},
						credentials: "include"
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
							"Content-Type": "application/json",
						},
						credentials: "include",
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
							"Content-Type": "application/json"
						},
						credentials: "include",
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
							"Content-type": "application/json"
						},
						credentials: "include"
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