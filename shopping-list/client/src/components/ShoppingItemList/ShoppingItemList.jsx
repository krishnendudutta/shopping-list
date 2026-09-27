import EmptyState from "../EmptyState/EmptyState";
import ShoppingItemCard from "../ShoppingItemCard/ShoppingItemCard";
import "./index.css";

function ShoppingItemList({
	shoppingItems,
	onEdit,
	onDelete,
	onTogglePurchased,
	emptyTitle = "No shopping items yet",
	emptyMessage = "Add your first item using the form above.",
}) {
	if (shoppingItems.length === 0) {
		return (
			<section className="panel empty-panel">
				<EmptyState title={emptyTitle} message={emptyMessage} />
			</section>
		);
	}

	return (
		<section className="items-grid">
			{shoppingItems.map((shoppingItem) => (
				<ShoppingItemCard
					key={shoppingItem._id}
					shoppingItem={shoppingItem}
					onEdit={onEdit}
					onDelete={onDelete}
					onTogglePurchased={onTogglePurchased}
				/>
			))}
		</section>
	);
}

export default ShoppingItemList;
