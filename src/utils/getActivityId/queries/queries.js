const getActivityIdQuery = `query getActivityId($identifier: bpchar) {
activities(where: { identifier: { _eq: $identifier } }) {
      id
  }  
}`;

module.exports = {
  getActivityIdQuery,
};
