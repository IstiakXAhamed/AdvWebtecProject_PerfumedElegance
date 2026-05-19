export declare enum Role {
    ADMIN = "admin",
    CUSTOMER = "customer"
}
export declare class User {
    id: string;
    fullName: string;
    email: string;
    password: string;
    role: Role;
    securityQuestion: string;
    securityAnswer: string;
}
