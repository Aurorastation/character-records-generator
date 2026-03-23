const CM_PER_INCH = 2.54;
const INCHES_PER_FOOT = 12;
const LB_PER_KG = 2.20462;

export function cmToFeetInches(cm: number): string {
	const totalInches = Math.round(cm / CM_PER_INCH);
	const feet = Math.floor(totalInches / INCHES_PER_FOOT);
	const inches = totalInches % INCHES_PER_FOOT;
	return `${feet}'${inches}"`;
}

export function feetInchesToCm(feet: number, inches: number): number {
	return (feet * INCHES_PER_FOOT + inches) * CM_PER_INCH;
}

export function kgToLb(kg: number): number {
	return kg * LB_PER_KG;
}

export function lbToKg(lb: number): number {
	return lb / LB_PER_KG;
}
