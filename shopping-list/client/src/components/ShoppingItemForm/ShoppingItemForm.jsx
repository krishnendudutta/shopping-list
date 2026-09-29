import { useEffect, useState } from "react";
import { validateShoppingItemForm } from "../../utils/validation";
import "./index.css";

const emptyForm = {
	name: "",
	quantity: 1,
	unit: "pcs",
	cost: 0,
	priority: "medium",
	vendor: "",
	period: "week",
	date: new Date().toISOString().slice(0, 10),
};

function ShoppingItemForm({ selectedItem, onSave, onCancel, isSaving }) {
	const [formData, setFormData] = useState(emptyForm);
	const [formErrors, setFormErrors] = useState({});

	useEffect(() => {
		if (selectedItem) {
			setFormData({
				name: selectedItem.name || "",
				quantity: selectedItem.quantity ?? 1,
				unit: selectedItem.unit || "pcs",
				cost: selectedItem.cost ?? 0,
				priority: selectedItem.priority || "medium",
				vendor: selectedItem.vendor || "",
				period: selectedItem.period || "week",
				date: selectedItem.date
					? selectedItem.date.slice(0, 10)
					: new Date().toISOString().slice(0, 10),
			});
		} else {
			setFormData(emptyForm);
		}
	}, [selectedItem]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormErrors((currentErrors) => ({
			...currentErrors,
			[name]: "",
		}));
		setFormData((currentForm) => ({
			...currentForm,
			[name]:
				name === "quantity" || name === "cost" ? Number(value) : value,
		}));
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		const validationErrors = validateShoppingItemForm(formData);

		if (Object.keys(validationErrors).length > 0) {
			setFormErrors(validationErrors);
			return;
		}

		setFormErrors({});
		onSave(formData);
	};

	return (
		<section className="panel form-panel">
			<div className="panel-header">
				<div>
					<p className="section-label">Shopping Item</p>
					<h2>{selectedItem ? "Edit item" : "Add a new item"}</h2>
				</div>
				{selectedItem ? (
					<button
						type="button"
						className="button button-secondary"
						onClick={onCancel}
					>
						Cancel edit
					</button>
				) : null}
			</div>

			<form className="shopping-form" onSubmit={handleSubmit}>
				<label>
					<span>Item name</span>
					<input
						className={formErrors.name ? "input-error" : ""}
						name="name"
						value={formData.name}
						onChange={handleChange}
						placeholder="Rice"
						required
					/>
					{formErrors.name ? (
						<small className="field-error">{formErrors.name}</small>
					) : null}
				</label>
				<label>
					<span>Quantity</span>
					<input
						className={formErrors.quantity ? "input-error" : ""}
						name="quantity"
						type="number"
						min="1"
						value={formData.quantity}
						onChange={handleChange}
						required
					/>
					{formErrors.quantity ? (
						<small className="field-error">
							{formErrors.quantity}
						</small>
					) : null}
				</label>
				<label>
					<span>Unit</span>
					<input
						className={formErrors.unit ? "input-error" : ""}
						name="unit"
						value={formData.unit}
						onChange={handleChange}
						placeholder="kg"
						required
					/>
					{formErrors.unit ? (
						<small className="field-error">{formErrors.unit}</small>
					) : null}
				</label>
				<label>
					<span>Cost</span>
					<input
						className={formErrors.cost ? "input-error" : ""}
						name="cost"
						type="number"
						min="0"
						step="0.01"
						value={formData.cost}
						onChange={handleChange}
						required
					/>
					{formErrors.cost ? (
						<small className="field-error">{formErrors.cost}</small>
					) : null}
				</label>
				<label>
					<span>Priority</span>
					<select
						className={formErrors.priority ? "input-error" : ""}
						name="priority"
						value={formData.priority}
						onChange={handleChange}
					>
						<option value="low">Low</option>
						<option value="medium">Medium</option>
						<option value="high">High</option>
					</select>
					{formErrors.priority ? (
						<small className="field-error">
							{formErrors.priority}
						</small>
					) : null}
				</label>
				<label>
					<span>Vendor</span>
					<input
						name="vendor"
						value={formData.vendor}
						onChange={handleChange}
						placeholder="Local store"
					/>
				</label>
				<label>
					<span>Period</span>
					<select
						className={formErrors.period ? "input-error" : ""}
						name="period"
						value={formData.period}
						onChange={handleChange}
					>
						<option value="day">Day</option>
						<option value="week">Week</option>
						<option value="month">Month</option>
					</select>
					{formErrors.period ? (
						<small className="field-error">
							{formErrors.period}
						</small>
					) : null}
				</label>
				<label>
					<span>Date</span>
					<input
						className={formErrors.date ? "input-error" : ""}
						name="date"
						type="date"
						value={formData.date}
						onChange={handleChange}
						required
					/>
					{formErrors.date ? (
						<small className="field-error">{formErrors.date}</small>
					) : null}
				</label>
				<div className="form-actions">
					<button
						type="submit"
						className="button button-primary"
						disabled={isSaving}
					>
						{isSaving
							? "Saving..."
							: selectedItem
								? "Update item"
								: "Add item"}
					</button>
				</div>
			</form>
		</section>
	);
}

export default ShoppingItemForm;
