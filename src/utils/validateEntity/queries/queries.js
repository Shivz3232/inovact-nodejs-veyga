const findIdea = `query findIdea($id: Int!) {
    idea(where: { id: { _eq: $id } }) {
      id
    }
}`;

const findProject = `query findProject($id: Int!) {
    project(where: { id: { _eq: $id } }) {
      id
    }   
}`;

const findThought = `query findThought($id: Int!) {
    thoughts(where: { id: { _eq: $id } }) {
      id
    }
}`;

module.exports = {
  findIdea,
  findProject,
  findThought,
};
