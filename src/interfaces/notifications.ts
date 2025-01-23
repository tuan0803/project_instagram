interface NotificationInterface {
  id?: number;
  userId: number;
  deviceToken?: string;
  notifiableType: string;
  notifiableId: number;
  title: string;
  shortContent: string;
  content: string;
  readAt?: number;
  data?: any;
  createdAt?: Date;
  updatedAt?: Date;
};

export default NotificationInterface;
