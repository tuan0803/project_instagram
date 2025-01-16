interface FollowerInterface {
    id?: number;
    followerId: number;
    followeeId: number;
    isApproved: boolean;
    createdAt?: Date;
  };

export default FollowerInterface;
