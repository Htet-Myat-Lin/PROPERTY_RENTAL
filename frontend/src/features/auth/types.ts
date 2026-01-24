export interface IUser {
    _id: string;
    username: string;
    email: string;
    role: "ADMIN" | "TENANT" | "LANDLORD",
    createdAt?: Date;
    updatedAt?: Date;
    isEmailVerified?: boolean;
}

export interface IAuthSlice {
    user: IUser | null;
    accessToken: string | null;
    loading: boolean;

    setUser: (user: IUser | null) => void;
    setAccessToken: (token: string | null) => void
    setLoading: (loading: boolean) => void
}