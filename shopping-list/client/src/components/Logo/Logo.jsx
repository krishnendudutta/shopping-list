import "./index.css";

function Logo() {
	return (
		<div className="brand-mark" aria-label="Shopping List logo">
			<div className="brand-mark__icon" aria-hidden="true">
				<svg viewBox="0 0 48 48" role="img" focusable="false">
					<defs>
						<linearGradient
							id="brandGradient"
							x1="0%"
							y1="0%"
							x2="100%"
							y2="100%"
						>
							<stop offset="0%" stopColor="#4f67d6" />
							<stop offset="100%" stopColor="#17b890" />
						</linearGradient>
					</defs>
					<circle
						cx="24"
						cy="24"
						r="22"
						fill="url(#brandGradient)"
						opacity="0.18"
					/>
					<path
						d="M16 17h16l-1.8 11.2c-.2 1.3-1.3 2.2-2.6 2.2h-7c-1.3 0-2.4-.9-2.6-2.2L16 17Z"
						fill="#ffffff"
						stroke="url(#brandGradient)"
						strokeWidth="1.8"
						strokeLinejoin="round"
					/>
					<path
						d="M19 17a5 5 0 0 1 10 0"
						fill="none"
						stroke="url(#brandGradient)"
						strokeWidth="1.8"
						strokeLinecap="round"
					/>
					<circle cx="20.5" cy="31.5" r="1.6" fill="#4f67d6" />
					<circle cx="27.5" cy="31.5" r="1.6" fill="#17b890" />
				</svg>
			</div>
			<div className="brand-mark__text">
				<span>Shopping List</span>
				<strong>Your Planner</strong>
			</div>
		</div>
	);
}

export default Logo;
