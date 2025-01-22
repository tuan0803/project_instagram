interface TokenInterface {
    id: number;
    userId: number;
    accessToken: string;
    refreshToken: string;
    createdAt?: Date;
    expiresAt: Date;
    refreshExpiresAt: Date;
};

export default TokenInterface;


