const IC_OFFSET = 442;

const MONTHS = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
];

function ordinal(n: number): string {
	if (n >= 11 && n <= 13) return n + 'th';
	switch (n % 10) {
		case 1: return n + 'st';
		case 2: return n + 'nd';
		case 3: return n + 'rd';
		default: return n + 'th';
	}
}

export function icYear(realYear: number): number {
	return realYear + IC_OFFSET;
}

export function formatICDate(date: Date): string {
	return `${MONTHS[date.getMonth()]} ${ordinal(date.getDate())}, ${icYear(date.getFullYear())}`;
}
