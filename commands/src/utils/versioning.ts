// Utils
import { exception } from "./terminal"

const stageBump = (stage, stageVer) => {
	if (!stage) return ""

	if (stageVer) {
		return `-${stage}.${stageVer}`
	}

	return `-${stage}`
}

const nextBump = (major, minor, patch, stage, stageVer) => (type) =>
	({
		major: `${major + 1}.${0}.${0}`,
		minor: `${major}.${minor + 1}.${0}`,
		patch: `${major}.${minor}.${patch + 1}`,
		beta: `${major}.${minor}.${patch}${stageBump("beta", stageVer + 1)}`,
		alpha: `${major}.${minor}.${patch}${stageBump("alpha", stageVer + 1)}`,
		"major beta": `${major + 1}.${0}.${0}${stageBump("beta", stage === "beta" ? (stageVer || 0) + 1 : 0)}`,
		"minor beta": `${major}.${minor + 1}.${0}${stageBump("beta", stage === "beta" ? (stageVer || 0) + 1 : 0)}`,
		"major alpha": `${major + 1}.${0}.${0}${stageBump("alpha", stage === "alpha" ? (stageVer || 0) + 1 : 0)}`,
		"minor alpha": `${major}.${minor + 1}.${0}${stageBump("alpha", stage === "alpha" ? (stageVer || 0) + 1 : 0)}`,
	}[type])

export const bump = (current, type) => {
	const [mainVer, stableVer] = current.split("-")
	const [major, minor, patch] = mainVer.split(".")
	const [stage, stageVer] = (stableVer || "").split(".")

	if (
		!(major && minor && patch) ||
		!(major.match(/\d/) && minor.match(/\d/) && patch.match(/\d/)) ||
		(stage &&
			(!["alpha", "beta"].includes(stage) ||
				(stageVer && !stageVer.match(/\d/))))
	) {
		exception(`Version ${current} is malformed`)
	}

	if (stage === "beta" && type.match("beta") && type !== "beta") {
		exception("Version can't go from one beta to another")
	}

	return nextBump(
		parseInt(major, 10),
		parseInt(minor, 10),
		parseInt(patch, 10),
		stage,
		parseInt(stageVer, 10),
	)(type)
}
