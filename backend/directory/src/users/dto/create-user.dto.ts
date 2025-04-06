export class CreateUserDto {
    phone?: string;
    password?: string;
    email: string;
    fullname?: string;
    pic?: string;
    gender?: string;
    role?: string;
    metadata?: JSON;
}
