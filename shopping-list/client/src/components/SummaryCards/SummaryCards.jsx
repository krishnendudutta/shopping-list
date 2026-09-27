import { formatCurrency } from "../../utils/formatters";
import "./index.css";

function SummaryCards({ summary }) {
	return (
		<section className="summary-grid">
			<div className="summary-card">
				<span>Items</span>
				<strong>{summary.count}</strong>
			</div>
			<div className="summary-card">
				<span>Planned cost</span>
				<strong>{formatCurrency(summary.plannedCost)}</strong>
			</div>
			<div className="summary-card">
				<span>Purchased cost</span>
				<strong>{formatCurrency(summary.purchasedCost)}</strong>
			</div>
			<div className="summary-card">
				<span>Pending cost</span>
				<strong>{formatCurrency(summary.pendingCost)}</strong>
			</div>
		</section>
	);
}

export default SummaryCards;
