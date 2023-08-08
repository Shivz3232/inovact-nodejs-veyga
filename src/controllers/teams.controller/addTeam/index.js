const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { addTeam, addInvitations, addRoles, addMembers, addTeamTags, addSkills } = require('./queries/mutations');
const { getUsersFromEmailId, getUserId } = require('./queries/queries');

const createTeam = catchAsync(async (req, res) => {
  const name = typeof req.body.name == 'string' && req.body.name.length != 0 ? req.body.name : false;
  const avatar = typeof req.body.avatar == 'string' && req.body.avatar.length != 0 ? req.body.avatar : 'https://static.vecteezy.com/system/resources/thumbnails/000/550/535/small/user_icon_007.jpg';
  const description = typeof req.body.description == 'string' && req.body.description.length != 0 ? req.body.description : '';
  const tags = req.body.tags instanceof Array ? req.body.tags : false;
  const members = req.body.members instanceof Array ? req.body.members : false;

  // Find user id
  const cognito_sub = req.body.cognito_sub;
  const response5 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  // Save team to DB
  const teamData = {
    name,
    creator_id: response5.result.data.user[0].id,
    description,
    avatar,
  };

  const response1 = await Hasura(addTeam, teamData);

  const team = response1.result.data.insert_team.returning[0];

  // Add current user as a member with admin: true
  let memberObjects = {
    objects: [
      {
        user_id: response5.result.data.user[0].id,
        team_id: team.id,
        admin: true,
      },
    ],
  };

  // Add members
  for (const member of members) {
    memberObjects.objects.push({
      user_id: member.user_id,
      team_id: team.id,
      role: member.role,
    });
  }

  const response6 = await Hasura(addMembers, { objects: memberObjects.objects });

  // // Save roles required for the team
  // role_if: if (roles.length) {
  //   const roleObjects = {
  //     objects: roles.map(role => {
  //       return {
  //         role_id: role.id,
  //         team_id: team.id,
  //       };
  //     }),
  //   };

  //   // @TODO Handle failure of roles insertion
  //   const response4 = await Hasura(addRoles, roleObjects);

  //   // Dont try to save skills if failed to save roles
  //   if (!response4.success) break role_if;

  //   // Save the skills required for each role
  //   let objects = [];
  //   for (const i in roles) {
  //     for (const j in roles[i].skills) {
  //       objects.push({
  //         role_requirement_id:
  //           response4.result.data.insert_team_role_requirements.returning[i]
  //             .id,
  //         skill_id: roles[i].skills[j].id,
  //         proficiency: roles[i].skills[j].proficiency,
  //       });
  //     }
  //   }

  //   const skillObjects = {
  //     objects,
  //   };

  //   // @TODO Handle failue of skills insertion
  //   const response5 = await Hasura(addSkills, skillObjects);
  // }

  // Save the tags associated with the team
  if (tags.length) {
    const tagsData = {
      objects: tags.map((tag_name) => {
        return {
          hashtag: {
            data: {
              name: tag_name.toLowerCase(),
            },
            on_conflict: {
              constraint: 'hashtag_tag_name_key',
              update_columns: 'name',
            },
          },
          team_id: team.id,
        };
      }),
    };

    // @TODO Fallback if tags fail to be inserted
    const response4 = await Hasura(addTeamTags, tagsData);
  }

  return res.status(201).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });

  // @TODO Handle emails of non existing users
  // @TODO Send invites over mail using emails of existing users
});

module.exports = createTeam;
