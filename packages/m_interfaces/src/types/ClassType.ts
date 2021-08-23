type ClassType<Instance extends Record<string, any>> = { new (): Instance }
export default ClassType