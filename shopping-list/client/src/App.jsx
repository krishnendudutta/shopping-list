import { useEffect, useState } from "react";
import ConfirmDialog from "./components/ConfirmDialog";
import Logo from "./components/Logo";
import LoadingState from "./components/LoadingState";
import ShoppingFilters from "./components/ShoppingFilters";
import ShoppingItemForm from "./components/ShoppingItemForm";
import ShoppingItemList from "./components/ShoppingItemList";
import SummaryCards from "./components/SummaryCards";
import {
	createShoppingItem,
	deleteShoppingItem,
	fetchShoppingItems,
	updateShoppingItem,
} from "./services/shoppingItemApi";
import {
	clearAuthToken,
	fetchCurrentUser,
	loginUser,
	registerUser,
	setAuthToken,
} from "./services/authApi";

const GUEST_USER_ID = "000000000000000000000001";

const guestUser = {
	id: GUEST_USER_ID,
	name: "Unknown User",
	email: "Guest mode",
};

const emptyFilters = {
	search: "",
	period: "",
	purchased: "",
	priority: "",
	vendor: "",
	date: "",
};

const emptyAuthForm = {
	name: "",
	email: "",
	password: "",
};

function App() {
	const today = new Date();
	const dayLabel = new Intl.DateTimeFormat(undefined, {
		weekday: "long",
	}).format(today);
	const dateLabel = new Intl.DateTimeFormat(undefined, {
		month: "long",
		day: "numeric",
		year: "numeric",
	}).format(today);

	const [currentUser, setCurrentUser] = useState(guestUser);
	const [showAuthPanel, setShowAuthPanel] = useState(false);
	const [authMode, setAuthMode] = useState("login");
	const [authForm, setAuthForm] = useState(emptyAuthForm);
	const [authError, setAuthError] = useState("");
	const [shoppingItems, setShoppingItems] = useState([]);
	const [selectedItem, setSelectedItem] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [filters, setFilters] = useState(emptyFilters);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const isGuest = currentUser.id === GUEST_USER_ID;

	const loadShoppingItems = async () => {
		try {
			setIsLoading(true);
			setErrorMessage("");
			const response = await fetchShoppingItems(filters);
			setShoppingItems(response.data || []);
		} catch (error) {
			setErrorMessage(error.message || "Could not load shopping items");
		} finally {
			setIsLoading(false);
		}
	};

	const hydrateCurrentUser = async () => {
		const token = window.localStorage.getItem("shopping-list-auth-token");

		if (!token) {
			setCurrentUser(guestUser);
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetchCurrentUser();
			setCurrentUser(response.data.user);
		} catch {
			clearAuthToken();
			setCurrentUser(guestUser);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		hydrateCurrentUser();
	}, []);

	useEffect(() => {
		loadShoppingItems();
	}, [filters, currentUser]);

	const showSuccessMessage = (message) => {
		setSuccessMessage(message);
		window.clearTimeout(window.successMessageTimer);
		window.successMessageTimer = window.setTimeout(() => {
			setSuccessMessage("");
		}, 2500);
	};

	const openAuthPanel = (mode) => {
		setAuthMode(mode);
		setAuthError("");
		setShowAuthPanel(true);
	};

	const closeAuthPanel = () => {
		setShowAuthPanel(false);
		setAuthError("");
	};

	const handleLogout = () => {
		clearAuthToken();
		setCurrentUser(guestUser);
		setAuthForm(emptyAuthForm);
		setAuthError("");
		setShowAuthPanel(false);
	};

	const handleAuthChange = (event) => {
		const { name, value } = event.target;
		setAuthForm((currentForm) => ({
			...currentForm,
			[name]: value,
		}));
	};

	const handleAuthSubmit = async (event) => {
		event.preventDefault();
		setAuthError("");

		try {
			const payload = {
				email: authForm.email.trim(),
				password: authForm.password,
			};

			if (authMode === "register") {
				payload.name = authForm.name.trim();
			}

			const response =
				authMode === "register"
					? await registerUser(payload)
					: await loginUser(payload);

			setAuthToken(response.data.token);
			setCurrentUser(response.data.user);
			setAuthForm(emptyAuthForm);
			setShowAuthPanel(false);
			setSelectedItem(null);
			setDeleteTarget(null);
		} catch (error) {
			setAuthError(error.message || "Could not authenticate");
		}
	};

	const handleSave = async (formData) => {
		try {
			setIsSaving(true);
			setErrorMessage("");

			if (selectedItem) {
				await updateShoppingItem(selectedItem._id, formData);
				showSuccessMessage("Shopping item updated successfully");
			} else {
				await createShoppingItem(formData);
				showSuccessMessage("Shopping item added successfully");
			}

			setSelectedItem(null);
			await loadShoppingItems();
		} catch (error) {
			setErrorMessage(error.message || "Could not save shopping item");
		} finally {
			setIsSaving(false);
		}
	};

	const handleEdit = (shoppingItem) => {
		setSelectedItem(shoppingItem);
		setErrorMessage("");
		setSuccessMessage("");
	};

	const handleCancelEdit = () => {
		setSelectedItem(null);
	};

	const handleFilterChange = (event) => {
		const { name, value } = event.target;
		setFilters((currentFilters) => ({
			...currentFilters,
			[name]: value,
		}));
	};

	const handleClearFilters = () => {
		setFilters(emptyFilters);
	};

	const handleDelete = async (shoppingItem) => {
		setDeleteTarget(shoppingItem);
	};

	const confirmDelete = async () => {
		if (!deleteTarget) {
			return;
		}

		try {
			setIsDeleting(true);
			setErrorMessage("");
			await deleteShoppingItem(deleteTarget._id);
			if (selectedItem?._id === deleteTarget._id) {
				setSelectedItem(null);
			}
			setDeleteTarget(null);
			showSuccessMessage("Shopping item deleted successfully");
			await loadShoppingItems();
		} catch (error) {
			setErrorMessage(error.message || "Could not delete shopping item");
		} finally {
			setIsDeleting(false);
		}
	};

	const cancelDelete = () => {
		setDeleteTarget(null);
	};

	const handleTogglePurchased = async (shoppingItem) => {
		try {
			setErrorMessage("");
			await updateShoppingItem(shoppingItem._id, {
				...shoppingItem,
				purchased: !shoppingItem.purchased,
			});
			showSuccessMessage(
				shoppingItem.purchased
					? "Marked as pending"
					: "Marked as purchased",
			);
			await loadShoppingItems();
		} catch (error) {
			setErrorMessage(error.message || "Could not update status");
		}
	};

	const totalCost = shoppingItems.reduce(
		(sum, shoppingItem) => sum + Number(shoppingItem.cost || 0),
		0,
	);
	const purchasedItems = shoppingItems.filter((item) => item.purchased);
	const pendingItems = shoppingItems.filter((item) => !item.purchased);
	const purchasedCost = purchasedItems.reduce(
		(sum, shoppingItem) => sum + Number(shoppingItem.cost || 0),
		0,
	);
	const pendingCost = pendingItems.reduce(
		(sum, shoppingItem) => sum + Number(shoppingItem.cost || 0),
		0,
	);
	const hasActiveFilters = Object.values(filters).some(
		(value) => value !== "",
	);
	const activeEmptyTitle = hasActiveFilters
		? "No items match your filters"
		: "No shopping items yet";
	const activeEmptyMessage = hasActiveFilters
		? "Try clearing one or more filters to see more items."
		: "Add your first item using the form above.";

	const summary = {
		count: shoppingItems.length,
		plannedCost: totalCost,
		purchasedCost,
		pendingCost,
	};

	return (
		<main className="app-shell">
			<div className="page-shell">
				<header className="page-header">
					<div className="brand-row">
						<Logo />
						<div
							className="date-card"
							aria-label="Today\'s date and day"
						>
							<span>{dayLabel}</span>
							<strong>{dateLabel}</strong>
							<p>Shop smart, save time, stay ready.</p>
						</div>
					</div>
					<div className="header-stack">
						<div className="hero-copy">
							<p className="eyebrow">Shopping List Manager</p>
							<h1>Your Shopping List</h1>
							<p className="description">
								Add items, edit them, mark them purchased, and
								keep track of the shopping plan in one simple
								place.
							</p>
							<div className="hero-chips">
								<span>Fast item tracking</span>
								<span>Clear weekly planning</span>
								<span>Simple shopping workflow</span>
							</div>
						</div>
					</div>
					<div className="header-actions">
					<div className="auth-strip">
						{isGuest ? (
							<>
								<button
									type="button"
									className="button button-secondary"
									onClick={() => openAuthPanel("login")}
								>
									Login
								</button>
								<button
									type="button"
									className="button button-primary"
									onClick={() => openAuthPanel("register")}
								>
									Register
								</button>
							</>
						) : (
							<div className="greeting-strip">
								<span>Hi, {currentUser.name}</span>
								<button
									type="button"
									className="button button-secondary button-small"
									onClick={handleLogout}
								>
									Logout
								</button>
							</div>
						)}
					</div>
					<div className="summary-pill">
						<span>Total items</span>
						<strong>{shoppingItems.length}</strong>
						<small>Planned from your current filters</small>
					</div>
				</div>
				</header>

				<SummaryCards summary={summary} />

				<ShoppingFilters
					filters={filters}
					onChange={handleFilterChange}
					onClear={handleClearFilters}
				/>

				{errorMessage ? (
					<div className="alert alert-error">{errorMessage}</div>
				) : null}
				{successMessage ? (
					<div className="alert alert-success">{successMessage}</div>
				) : null}

				<div className="content-grid">
					<ShoppingItemForm
						selectedItem={selectedItem}
						onSave={handleSave}
						onCancel={handleCancelEdit}
						isSaving={isSaving}
					/>

					<section className="panel list-panel">
						<div className="panel-header">
							<div>
								<p className="section-label">Shopping Items</p>
								<h2>
									{hasActiveFilters
										? "Filtered items"
										: "All items"}
								</h2>
							</div>
							<button
								type="button"
								className="button button-secondary"
								onClick={loadShoppingItems}
							>
								Refresh
							</button>
						</div>

						{isLoading ? (
							<LoadingState />
						) : (
							<ShoppingItemList
								shoppingItems={shoppingItems}
								onEdit={handleEdit}
								onDelete={handleDelete}
								onTogglePurchased={handleTogglePurchased}
								emptyTitle={activeEmptyTitle}
								emptyMessage={activeEmptyMessage}
							/>
						)}
					</section>
				</div>
			</div>

			{showAuthPanel ? (
				<div className="auth-modal-backdrop" onClick={closeAuthPanel}>
					<section
						className="panel auth-modal-card"
						onClick={(event) => event.stopPropagation()}
					>
						<div className="auth-modal-header">
							<div>
								<p className="section-label">
									Optional account
								</p>
								<h2>
									{authMode === "register"
										? "Create an account"
										: "Sign in"}
								</h2>
							</div>
							<button
								type="button"
								className="button button-secondary button-small"
								onClick={closeAuthPanel}
							>
								Close
							</button>
						</div>
						<p className="description">
							You can keep using the app as Unknown User, or sign
							in to keep a separate list.
						</p>
						<div className="auth-toggle">
							<button
								type="button"
								className={
									authMode === "login"
										? "button button-primary"
										: "button button-secondary"
								}
								onClick={() => setAuthMode("login")}
							>
								Login
							</button>
							<button
								type="button"
								className={
									authMode === "register"
										? "button button-primary"
										: "button button-secondary"
								}
								onClick={() => setAuthMode("register")}
							>
								Register
							</button>
						</div>
						{authError ? (
							<div className="alert alert-error">{authError}</div>
						) : null}
						<form className="auth-form" onSubmit={handleAuthSubmit}>
							{authMode === "register" ? (
								<label>
									<span>Name</span>
									<input
										name="name"
										value={authForm.name}
										onChange={handleAuthChange}
										placeholder="Your name"
										required
									/>
								</label>
							) : null}
							<label>
								<span>Email</span>
								<input
									name="email"
									type="email"
									value={authForm.email}
									onChange={handleAuthChange}
									placeholder="you@example.com"
									required
								/>
							</label>
							<label>
								<span>Password</span>
								<input
									name="password"
									type="password"
									value={authForm.password}
									onChange={handleAuthChange}
									placeholder="At least 6 characters"
									required
								/>
							</label>
							<div className="form-actions">
								<button
									type="submit"
									className="button button-primary"
								>
									{authMode === "register"
										? "Create account"
										: "Sign in"}
								</button>
							</div>
						</form>
					</section>
				</div>
			) : null}

			<ConfirmDialog
				title={deleteTarget ? `Delete ${deleteTarget.name}?` : ""}
				message={
					deleteTarget
						? "This action cannot be undone. The item will be removed from your shopping list."
						: ""
				}
				confirmText={isDeleting ? "Deleting..." : "Delete"}
				cancelText="Cancel"
				onConfirm={confirmDelete}
				onCancel={cancelDelete}
			/>
		</main>
	);
}

export default App;
