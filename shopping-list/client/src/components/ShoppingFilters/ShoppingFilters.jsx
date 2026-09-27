import "./index.css";

function ShoppingFilters({ filters, onChange, onClear }) {
	return (
		<section className="panel filters-panel">
			<div className="panel-header">
				<div>
					<p className="section-label">Search and filters</p>
					<h2>Refine items</h2>
				</div>
				<button
					type="button"
					className="button button-secondary"
					onClick={onClear}
				>
					Clear filters
				</button>
			</div>

			<div className="filters-grid">
				<label>
					<span>Search</span>
					<input
						name="search"
						value={filters.search}
						onChange={onChange}
						placeholder="Search by item name"
					/>
				</label>

				<label>
					<span>Period</span>
					<select
						name="period"
						value={filters.period}
						onChange={onChange}
					>
						<option value="">All periods</option>
						<option value="day">Day</option>
						<option value="week">Week</option>
						<option value="month">Month</option>
					</select>
				</label>

				<label>
					<span>Status</span>
					<select
						name="purchased"
						value={filters.purchased}
						onChange={onChange}
					>
						<option value="">All items</option>
						<option value="false">Pending</option>
						<option value="true">Purchased</option>
					</select>
				</label>

				<label>
					<span>Priority</span>
					<select
						name="priority"
						value={filters.priority}
						onChange={onChange}
					>
						<option value="">All priorities</option>
						<option value="low">Low</option>
						<option value="medium">Medium</option>
						<option value="high">High</option>
					</select>
				</label>

				<label>
					<span>Vendor</span>
					<input
						name="vendor"
						value={filters.vendor}
						onChange={onChange}
						placeholder="Local store"
					/>
				</label>

				<label>
					<span>Date</span>
					<input
						name="date"
						type="date"
						value={filters.date}
						onChange={onChange}
					/>
				</label>
			</div>
		</section>
	);
}

export default ShoppingFilters;
