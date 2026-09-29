const AUTH_TOKEN_KEY = "shopping-list-auth-token";

const AUTH_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const fetchJson = async (url, options = {}) => {
	const response = await fetch(url, options);
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

export const getAuthToken = () => window.localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token) => {
	if (token) {
		window.localStorage.setItem(AUTH_TOKEN_KEY, token);
	} else {
		window.localStorage.removeItem(AUTH_TOKEN_KEY);
	}
};

export const clearAuthToken = () => {
	window.localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const registerUser = async (payload) => {
	return fetchJson(`${AUTH_BASE_URL}/auth/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
};

export const loginUser = async (payload) => {
	return fetchJson(`${AUTH_BASE_URL}/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
};

export const fetchCurrentUser = async () => {
	const token = getAuthToken();

	if (!token) {
		throw new Error("No auth token");
	}

	return fetchJson(`${AUTH_BASE_URL}/auth/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};
