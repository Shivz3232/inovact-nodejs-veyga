function cleanTeamDocs(teamDoc) {
  teamDoc.team_role_requirements = teamDoc.team_role_requirements.map((team_role_requirement) => {
    team_role_requirement.team_skill_requirements = team_role_requirement.team_skill_requirements.map(
      (ele) => ele.skill_name
    );
    return team_role_requirement;
  });

  teamDoc.project_tags = [];

  for (const project of teamDoc.projects) {
    const temp = project.tags.map((tag) => {
      return tag.hashtag.name;
    });

    delete project.tags;

    teamDoc.project_tags = [...teamDoc.project_tags, temp];
  }
  teamDoc.idea_tags = [];

  for (const idea of teamDoc.ideas) {
    const temp = idea.tags.map((tag) => {
      return tag.hashtag.name;
    });

    delete idea.tags;

    teamDoc.idea_tags = [...teamDoc.idea_tags, temp];
  }

  teamDoc.team_tags = teamDoc.team_tags.map((team_tag) => {
    return {
      name: team_tag.hashtag.name,
    };
  });

  teamDoc.admin_id = teamDoc.team_members.filter((doc) => doc.admin)[0].user.id;

  teamDoc.team_requests = teamDoc.team_requests.map((team_request) => {
    let temp = {};
    temp.id = team_request.id;
    temp.user = team_request.user;
    temp.requested_on = team_request.requested_on;
    temp.required_role = team_request.team_role_requirement ? team_request.team_role_requirement.role_name : 'mentor';

    return temp;
  });

  return teamDoc;
}

module.exports = cleanTeamDocs;
