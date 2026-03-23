let dark = $state(false);

export const theme = {
	get dark() { return dark; },

	init() {
		const stored = localStorage.getItem('theme');
		if (stored) {
			dark = stored === 'dark';
		} else {
			dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}
		apply();
	},

	toggle() {
		dark = !dark;
		localStorage.setItem('theme', dark ? 'dark' : 'light');
		apply();
	}
};

function apply() {
	document.documentElement.classList.toggle('dark', dark);
}
