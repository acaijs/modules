// Interfaces
import StringToType from "./stringToType";

type ArrayToType<t extends readonly string[], s extends number[] = []> =
	// check if we looped entire array
	t["length"] extends s["length"] ?
		// if so return it's last element
		StringToType<t[s[0]]> :
		// instead look if current index returns a valid type
		StringToType<t[s[0]]> extends never ?
			// we limit the count because arrays could be "infinite" for typescript, so we want to prevent its failsafe lock
			s[0] extends 20 ?
				StringToType<t[s[0]]>:
			// current index didn't return a valid type
			ArrayToType<t, [s["length"], ...s]> :
			// current index returned a valid type
			StringToType<t[s[0]]>;

export default ArrayToType;