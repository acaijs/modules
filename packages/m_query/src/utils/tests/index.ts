// Packages
import test from "@acai/testing"

// Abstractions
import QueryAbstract from "../../abstractions/builder"

// Methods
import adapterGetTests from "./get"
import adapterColumnTests from "./column"
import adapterDeleteTests from "./delete"
import adapterInsertTests from "./insert"
import adapterUpdateTests from "./update"
import adapterConnectionTests from "./connection"
import adapterColumnRelationTests from "./column.relation"
import adapterRelationUpdateTests from "./relation.update"
import adapterColumnTypeTests from "./column.type"
import adapterTransactionTests from "./transaction"

export default function testAdapter (name: string, adapter: typeof QueryAbstract, settings: any) {
	test.group(`${name} tests`, () => {
		adapterGetTests(name, adapter, settings)
		adapterColumnTests(name, adapter, settings)
		adapterDeleteTests(name, adapter, settings)
		adapterInsertTests(name, adapter, settings)
		adapterUpdateTests(name, adapter, settings)
		adapterConnectionTests(name, adapter, settings)
		adapterColumnTypeTests(name, adapter, settings)
		adapterTransactionTests(name, adapter, settings)
		adapterColumnRelationTests(name, adapter, settings)
		adapterRelationUpdateTests(name, adapter, settings)
	})
}