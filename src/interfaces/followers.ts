interface FollowerInterface {
    id?: number;
    followerId: number;
    followeeId: number;
    isApproved: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };

export default FollowerInterface;