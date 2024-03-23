import "typescript";

declare module "typescript" {
    interface Program {
        getTypeCatalog(): readonly Type[];
    }

    interface TypeChecker {
        isTypeAssignableTo(source: Type, target: Type): boolean;
    }
}
