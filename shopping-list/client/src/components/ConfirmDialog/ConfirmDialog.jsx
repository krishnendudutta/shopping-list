import "./index.css";

function ConfirmDialog({
	title,
	message,
	confirmText,
	cancelText,
	onConfirm,
	onCancel,
}) {
	if (!title) {
		return null;
	}

	return (
		<div className="dialog-backdrop" role="presentation" onClick={onCancel}>
			<div
				className="dialog-card"
				role="dialog"
				aria-modal="true"
				aria-labelledby="confirm-dialog-title"
				onClick={(event) => event.stopPropagation()}
			>
				<h3 id="confirm-dialog-title">{title}</h3>
				<p>{message}</p>
				<div className="dialog-actions">
					<button
						type="button"
						className="button button-secondary"
						onClick={onCancel}
					>
						{cancelText || "Cancel"}
					</button>
					<button
						type="button"
						className="button button-danger"
						onClick={onConfirm}
					>
						{confirmText || "Delete"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmDialog;
