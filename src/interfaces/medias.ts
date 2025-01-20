interface MediaInterface {
  id: number;
  postId: number;
  url: string;
  type: string;
}
interface MediaCreationAttributes extends Omit<MediaInterface, 'id'> { }

export { MediaCreationAttributes };
export default MediaInterface;
