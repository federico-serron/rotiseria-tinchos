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
			menu: {},
			menuItem: [],
			categories: [],
			pagination: {},
			catPagination: {},
			invoicePagination: {},
			userPagination: {},
			cart: [],

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
			getMenuItemsPaginated: async (page, perPage) => {
				const URLgetMenuItems = `${backendUrl}/menu`;
				const store = getStore()
				const queryParams = []

				try {

					queryParams.push(`page=${page ?? 1}`);
					queryParams.push(`per_page=${perPage ?? 10}`);

					const response = await fetch(queryParams.length > 0 ? `${URLgetMenuItems}?${queryParams.join('&')}` : URLgetMenuItems, {
						method: "GET"
					})

					const data = await response.json()

					if (!response.ok) {
						throw new Error(data.error);
					}

					setStore({
						...store,
						menu: data.menu,
						pagination: {
							...store.pagination,
							total: data.total,
							page: data.page,
							per_page: data.per_page,
							pages: data.pages,
							has_next: data.has_next,
							has_prev: data.has_prev,
							next_num: data.next_num,
							prev_num: data.prev_num
						}
					});
					return true

				} catch (error) {
					setStore({ ...store, error: error.message })
					console.error(store.error)
					return false
				}

			},


			getMenuItems: async () => {
				const URLgetMenuItems = `${backendUrl}/menu`;
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


			getMenuItemById: async (id) => {
				const URLgetMenuItemById = `${backendUrl}/menu/`;
				const store = getStore()

				try {

					const response = await fetch(`${URLgetMenuItemById}/${id}`, {
						method: "GET"
					})

					const data = await response.json()

					if (!response.ok) {
						throw new Error(data.error);
					}

					setStore({ ...store, menuItem: data.menu })
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
			getCategoriesPaginated: async (page, perPage) => {
				const URLgetCategories = `${backendUrl}/categories/paginated`;
				const store = getStore()
				const queryParams = []

				try {

					queryParams.push(`page=${page ?? 1}`);
					queryParams.push(`per_page=${perPage ?? 6}`);

					const response = await fetch(queryParams.length > 0 ? `${URLgetCategories}?${queryParams.join('&')}` : URLgetCategories, {
						method: "GET"
					})

					const data = await response.json()

					if (!response.ok) {
						throw new Error(data.error);
					}

					setStore({
						...store,
						categories: data.categories,
						catPagination: {
							...store.catPagination,
							total: data.total,
							page: data.page,
							per_page: data.per_page,
							pages: data.pages,
							has_next: data.has_next,
							has_prev: data.has_prev,
							next_num: data.next_num,
							prev_num: data.prev_num
						}
					});
					return true

				} catch (error) {
					setStore({ ...store, error: error.message })
					console.error(store.error)
					return false
				}

			},


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

			///////////////////////////////////////////////// CART /////////////////////////////////////////////////////////////////
			loadCartFromStorage: () => {
				const store = getStore();
				if (typeof window === "undefined") return [];
				try {
					const saved = localStorage.getItem("cart");
					const parsed = saved ? JSON.parse(saved) : [];
					setStore({ ...store, cart: parsed });
					return parsed;
				} catch {
					setStore({ ...store, cart: [] });
					return [];
				}
			},

			_saveCart: (cart) => {
				if (typeof window === "undefined") return;
				localStorage.setItem("cart", JSON.stringify(cart));
			},

			addToCart: (item) => {
				const store = getStore();
				const existingItem = store.cart.find((cartItem) => cartItem.id === item.id);
				let updatedCart;

				if (existingItem) {
					updatedCart = store.cart.map((cartItem) =>
						cartItem.id === item.id
							? { ...cartItem, quantity: cartItem.quantity + 1 }
							: cartItem
					);
				} else {
					updatedCart = [...store.cart, { ...item, quantity: 1 }];
				}

				setStore({ ...store, cart: updatedCart });
				getActions()._saveCart(updatedCart);
				return updatedCart;
			},

			updateCartQuantity: (menuId, quantity) => {
				const store = getStore();
				if (quantity <= 0) return getActions().removeFromCart(menuId);

				const updatedCart = store.cart.map((item) =>
					item.id === menuId ? { ...item, quantity } : item
				);

				setStore({ ...store, cart: updatedCart });
				getActions()._saveCart(updatedCart);
				return updatedCart;
			},

			removeFromCart: (menuId) => {
				const store = getStore();
				const updatedCart = store.cart.filter((item) => item.id !== menuId);
				setStore({ ...store, cart: updatedCart });
				getActions()._saveCart(updatedCart);
				return updatedCart;
			},

			clearCart: () => {
				const store = getStore();
				setStore({ ...store, cart: [] });
				getActions()._saveCart([]);
			},

			getCartTotal: () => {
				const store = getStore();
				return store.cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
			},

			getCartCount: () => {
				const store = getStore();
				return store.cart.reduce((acc, item) => acc + item.quantity, 0);
			},

			_createPayloadFromCart: () => {
				const store = getStore();
				return store.cart.map((item) => ({
					menu_id: item.id,
					quantity: item.quantity
				}));
			},

			createInvoice: async () => {
				const store = getStore();
				const URLInvoice = `${backendUrl}/invoices/`;
				const items = getActions()._createPayloadFromCart();

				if (items.length === 0) {
					setStore({ ...store, error: "El carrito está vacío" });
					return null;
				}

				try {
					const response = await fetch(URLInvoice, {
						method: "POST",
						headers: {
							"Content-type": "application/json"
						},
						body: JSON.stringify({ items }),
						credentials: "include"
					});

					const data = await response.json();

					if (!response.ok) {
						throw new Error(data.error || "No pudimos crear la orden");
					}

					setStore({ ...store, message: "Orden creada correctamente" });
					return data.invoice;
				} catch (error) {
					setStore({ ...store, error: error.message });
					return null;
				}
			},

			createPaypalOrder: async () => {
				const store = getStore();
				const URLPaypalOrder = `${backendUrl}/payments/paypal/create-order`;
				const items = getActions()._createPayloadFromCart();

				if (items.length === 0) {
					setStore({ ...store, error: "El carrito está vacío" });
					return null;
				}

				try {
					const response = await fetch(URLPaypalOrder, {
						method: "POST",
						headers: {
							"Content-type": "application/json"
						},
						body: JSON.stringify({ items }),
						credentials: "include"
					});

					const data = await response.json();

					if (!response.ok) {
						throw new Error(data.error || "No pudimos iniciar el pago");
					}

					return data;
				} catch (error) {
					setStore({ ...store, error: error.message });
					return null;
				}
			},

			capturePaypalOrder: async (orderId) => {
				const store = getStore();
				const URLPaypalCapture = `${backendUrl}/payments/paypal/capture`;
				const items = getActions()._createPayloadFromCart();

				if (items.length === 0) {
					setStore({ ...store, error: "El carrito está vacío" });
					return null;
				}

				try {
					const response = await fetch(URLPaypalCapture, {
						method: "POST",
						headers: {
							"Content-type": "application/json"
						},
						body: JSON.stringify({ order_id: orderId, items }),
						credentials: "include"
					});

					const data = await response.json();

					if (!response.ok) {
						throw new Error(data.error || "No pudimos confirmar el pago");
					}

					setStore({ ...store, message: "Pago aprobado", cart: [] });
					getActions()._saveCart([]);
					return data;
				} catch (error) {
					setStore({ ...store, error: error.message });
					return null;
				}
			},

			///////////////////////////////////////////////// INVOINCES /////////////////////////////////////////////////////////////////
		}
	};
};

export default getState;
