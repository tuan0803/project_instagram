interface UserInterface {
    id: number;
    name: string;
    email: string;
    password: string;
    bio: string;
    phoneNumber: number;
    avatarUrl: string;
    isPrivate: boolean;
    isActive: boolean;
    firstLoginDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
};

export default UserInterface;
