import "./index.css";
import {
	formatCurrency,
	formatDate,
	getPriorityLabel,
} from "../../utils/formatters";

function ShoppingItemCard({
	shoppingItem,
	onEdit,
	onDelete,
	onTogglePurchased,
}) {
	return (
		<article className="shopping-card">
			<div className="shopping-card-top">
				<div>
					<h3>{shoppingItem.name}</h3>
					<p className="shopping-meta">
						{shoppingItem.quantity} {shoppingItem.unit} ·{" "}
						{formatCurrency(shoppingItem.cost)}
					</p>
				</div>
				<span
					className={`status-badge ${shoppingItem.purchased ? "status-purchased" : "status-pending"}`}
				>
					{shoppingItem.purchased ? "Purchased" : "Pending"}
				</span>
			</div>

			<div className="shopping-details">
				<p>
					<strong>Vendor:</strong> {shoppingItem.vendor || "-"}
				</p>
				<p>
					<strong>Priority:</strong>{" "}
					{getPriorityLabel(shoppingItem.priority)}
				</p>
				<p>
					<strong>Period:</strong> {shoppingItem.period}
				</p>
				<p>
					<strong>Date:</strong> {formatDate(shoppingItem.date)}
				</p>
			</div>

			<div className="card-actions">
				<button
					type="button"
					className="button button-ghost"
					onClick={() => onTogglePurchased(shoppingItem)}
				>
					{shoppingItem.purchased ? "Mark pending" : "Mark purchased"}
				</button>
				<button
					type="button"
					className="button button-secondary"
					onClick={() => onEdit(shoppingItem)}
				>
					Edit
				</button>
				<button
					type="button"
					className="button button-danger"
					onClick={() => onDelete(shoppingItem)}
				>
					Delete
				</button>
			</div>
		</article>
	);
}

export default ShoppingItemCard;
