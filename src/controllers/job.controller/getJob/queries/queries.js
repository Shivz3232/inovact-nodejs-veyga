const getJobsQuery = `query GetJobs($limit: Int!, $offset: Int!, $where: recruitment_jobs_bool_exp = {}) {
    recruitment_jobs(
      limit: $limit
      offset: $offset
      where: $where
      order_by: { created_at: desc }
    ) {
          id
          user_id
          title
          description
          type
          city
          min_salary
          max_salary
          status
          company_id
          duration
          deadline
          created_at
          updated_at
    			company{
              id
              name
              website
              linkedin_url
              created_at
              updated_at
          }
      		job_skills{
              id
              skill
              type
          }
      		assignments{
              id
              description
              submission_type
              deadline
          }
    }
  }`;

const getJobByIdQuery = `query GetJobById($id: uuid!) {
    recruitment_jobs(where: {id: {_eq: $id}}) {
       id
          user_id
          title
          description
          type
          city
          min_salary
          max_salary
          status
          company_id
          duration
          deadline
          created_at
          updated_at
    			company{
              id
              name
              website
              linkedin_url
              created_at
              updated_at
          }
      		job_skills{
              id
              skill
              type
          }
      		assignments{
              id
              description
              submission_type
              deadline
          }
    }
  }
`;

module.exports = {
  getJobsQuery,
  getJobByIdQuery,
};
