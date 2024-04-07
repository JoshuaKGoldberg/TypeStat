import "typescript";

declare module "typescript" {
	interface Program {
		getTypeCatalog(): readonly Type[];
	}
}
