export const containerVariants = {
	hidden: {},
	show: {
		transition: {
			staggerChildren: 0.1,
		},
	},
};

export const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4, ease: "easeOut" },
	},

	highlightInput: {
		scale: [1, 1.05, 0.96, 1], // small pop effect

		backgroundColor: ["#052e16", "#014108", "#052e16"],
		transition: { duration: 1, ease: "easeInOut" },
	},

	highlightItem: {
		scale: [1, 1.05, 0.96, 1], // small pop effect
		transition: { duration: 1, ease: "easeInOut" },
	},

	exit: {
		x: "-100%", // slide out to the left
		backgroundColor: [
			
			"rgba(229,21,21,1)", // red highlight
			"rgba(229,21,21,0)", // fade out
		],
		opacity: [1, 0.9, 0],
		transition: {
			duration: 0.6,
			ease: "easeInOut",
		},
	},
};
