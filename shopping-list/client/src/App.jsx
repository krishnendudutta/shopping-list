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
import { formatCurrency } from "./utils/formatters";

const emptyFilters = {
	search: "",
	period: "",
	purchased: "",
	priority: "",
	vendor: "",
	date: "",
};

function App() {
	const [shoppingItems, setShoppingItems] = useState([]);
	const [selectedItem, setSelectedItem] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [filters, setFilters] = useState(emptyFilters);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

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

	useEffect(() => {
		loadShoppingItems();
	}, [filters]);

	const showSuccessMessage = (message) => {
		setSuccessMessage(message);
		window.clearTimeout(window.successMessageTimer);
		window.successMessageTimer = window.setTimeout(() => {
			setSuccessMessage("");
		}, 2500);
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
					<div className="hero-copy">
						<Logo />
						<p className="eyebrow">Shopping List Manager</p>
						<h1>Your Shopping List</h1>
						<p className="description">
							Add items, edit them, mark them purchased, and keep
							track of the shopping plan in one simple place.
						</p>
						<div className="hero-chips">
							<span>Fast item tracking</span>
							<span>Clear weekly planning</span>
							<span>Simple shopping workflow</span>
						</div>
					</div>
					<div className="summary-pill">
						<span>Total items</span>
						<strong>{shoppingItems.length}</strong>
						<small>Planned from your current filters</small>
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
