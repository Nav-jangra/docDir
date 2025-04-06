export class CreateRoleDto {
    readonly name: string;
    readonly description?: string;
    readonly isEditable?: number;
    readonly permissions: string[];
}

