const Composable = (arr) => ({
	forEach: (cb) => { arr.forEach(cb); return Composable(arr) },
	map: (cbOrAr) => {
		if (Array.isArray(cbOrAr)) {
			return Composable(arr.map(i => cbOrAr.reduce((prev, curr) => curr(prev), i)))
		}

		return Composable(arr.map(cbOrAr))
	},
	fold: () => arr,
	compose: (reducer) => (value: any) => arr.reduce(reducer, value),
	toString: `Composable([${arr.map(arr => typeof arr).join(", ")}])`,
})

export default Composable