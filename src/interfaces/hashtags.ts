interface HashtagInterface {
  id: number;
  name: string;
}
interface HashtagCreationAttributes extends Omit<HashtagInterface, 'id' > { }

export { HashtagCreationAttributes };
export default HashtagInterface;
