interface UserInterface {
    id: number;
    name: string;
    email: string;
    password: string;
    bio: string;
    phone_number: number;
    avatar_url: string;
    is_private: boolean;
    created_at?: Date;
    updated_at?: Date;
};

export default UserInterface;
