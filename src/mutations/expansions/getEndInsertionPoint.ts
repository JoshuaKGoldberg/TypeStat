import * as ts from "typescript";

export const getEndInsertionPoint = ({ end, members }: ts.InterfaceDeclaration | ts.TypeLiteralNode) => {
    if (members.length === 0) {
        return end - 1;
    }

    const lastMember = members[members.length - 1];

    return Math.min(lastMember.end + 1, end);
};
