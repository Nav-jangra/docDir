export class CreatePermissionDto {
    readonly name: string;
    readonly description?: string;
    readonly entity: string;
    readonly action: string;
}