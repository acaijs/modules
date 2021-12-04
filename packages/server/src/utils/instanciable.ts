export default function instanciable (income: any) {
	if (!income) return {}

	if (income.constructor && income.prototype?.constructor === income) return new income()

	return income
}