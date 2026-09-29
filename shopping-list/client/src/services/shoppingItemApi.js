import { getAuthToken } from "./authApi";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const buildQueryString = (filters = {}) => {
	const params = new URLSearchParams();

	Object.entries(filters).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== "") {
			params.set(key, value);
		}
	});

	const queryString = params.toString();
	return queryString ? `?${queryString}` : "";
};

const getJson = async (response) => {
	const rawBody = await response.text();
	let data = null;

	if (rawBody) {
		try {
			data = JSON.parse(rawBody);
		} catch {
			data = null;
		}
	}

	if (!response.ok) {
		const error = new Error(
			data?.message || rawBody || "Something went wrong",
		);
		error.status = response.status;
		throw error;
	}

	return data || {};
};

const fetchJson = async (url, options = {}) => {
	try {
		const headers = {
			...(options.headers || {}),
		};
		const token = getAuthToken();

		if (token && !headers.Authorization) {
			headers.Authorization = `Bearer ${token}`;
		}

		const response = await fetch(url, {
			...options,
			headers,
		});
		return await getJson(response);
	} catch (error) {
		throw new Error(
			error.message ||
				"Unable to reach the API. Make sure the backend is running.",
		);
	}
};

export const fetchShoppingItems = async (filters = {}) => {
	return fetchJson(`${API_BASE_URL}/items${buildQueryString(filters)}`);
};

export const createShoppingItem = async (shoppingItem) => {
	return fetchJson(`${API_BASE_URL}/items`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(shoppingItem),
	});
};

export const updateShoppingItem = async (shoppingItemId, shoppingItem) => {
	return fetchJson(`${API_BASE_URL}/items/${shoppingItemId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(shoppingItem),
	});
};

export const deleteShoppingItem = async (shoppingItemId) => {
	return fetchJson(`${API_BASE_URL}/items/${shoppingItemId}`, {
		method: "DELETE",
	});
};
