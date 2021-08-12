const compose = <Unary = unknown> (...args: ((arg: Unary) => Unary)[]) => (initializer: Unary) => args.reverse().reduce((prev, curr) => curr(prev), initializer)
export default compose