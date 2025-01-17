interface TokenInterface {
    id: number;
    user_id: number;
    access_token: string;
    refresh_token: string;
    created_at?: Date;
    expires_at: Date;
    refresh_expires_at: Date;
};

export default TokenInterface;


