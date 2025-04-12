const checkJobExistsAndExistingApplicationQuery = `
  query CheckJobExistsAndExistingApplication($id: Int!, $cognito_sub: String!) {
    jobs_by_pk(id: $id) {
      id
      job_title
      application_deadline
      job_status
    }
    applications(where: {job_id: {_eq: $id}, applicant: {cognito_sub: {_eq: $cognito_sub}}}) {
      id
      status
    }
    user(where: {
      cognito_sub: {_eq: $cognito_sub}
    }){
      id
      email_id
      first_name
      last_name
    }
  }
`;

module.exports = { checkJobExistsAndExistingApplicationQuery };
