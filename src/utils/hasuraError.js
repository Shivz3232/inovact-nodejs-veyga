class hasuraRequestFailed extends Error {
  constructor(message) {
    super(message);
    this.name = 'Failed to reach the Database';
  }
}
class hasuraNoDataException extends Error {
  constructor(message) {
    super(message);
    this.name = 'No data found in Hasura Query';
  }
}

module.exports = { hasuraRequestFailed, hasuraNoDataException };
