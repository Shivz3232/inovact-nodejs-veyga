const getRolesWithPrefix = `query getRoles($_role: String) {
    roles(
      where:{
        name:{
          _ilike:$_role
        }
      }
    ) {
      id,
      name,
    }
  }`;

const getRoles = `query getRoles {
  roles {
    id
    name
  }
}`;

module.exports = {
  getRoles,
  getRolesWithPrefix,
};
