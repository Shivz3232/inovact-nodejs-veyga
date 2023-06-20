const getTagsWithPrefix = `query getTagsWithPrefix($_tag: String) {
    hashtag(
      where:{
        name:{
          _ilike:$_tag
        }
      }
    ) {
      id,
      name,
    }
  }`;

const getTags = `getTags {
  hashtag {
    id
    name
  }
}
`;

module.exports = {
  getTags,
  getTagsWithPrefix,
};
