const rejectJoinRequest = `mutation rejectJoinRequest($request_id: Int) {
	delete_team_requests(where: {id: {_eq: $request_id}}) {
    affected_rows
  }
}`;

module.exports = {
  rejectJoinRequest,
};
