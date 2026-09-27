import "./index.css";

function LoadingState({ message = "Loading shopping items..." }) {
	return (
		<div className="loading-state">
			<div className="loading-bar" />
			<p>{message}</p>
		</div>
	);
}

export default LoadingState;
