const {
  deleteTeamMembers,
  deleteRoleSkills,
  deleteRoles,
  addSkillsRequired,
  addRolesRequired,
} = require('./queries/mutations');
const { getRoleRequirements } = require('./queries/queries');

const handleRoleAndSkillUpdates = async (teamId, newRoles, Hasura) => {
  try {
    // 1. Get current roles and their associated members and skills
    const currentRolesResponse = await Hasura(getRoleRequirements, {
      team_id: teamId,
    });

    const currentRoles = currentRolesResponse.result.data.team_role_requirements;

    // Create maps for easier lookup
    const currentRoleMap = new Map(currentRoles.map((role) => [role.role_name, role]));
    const newRoleMap = new Map(newRoles.map((role) => [role.role_name, role]));

    // Arrays to track what needs to be deleted, added, or updated
    const rolesToDelete = [];
    const rolesToAdd = [];
    const rolesToUpdate = [];

    // Find roles to delete or update
    for (const currentRole of currentRoles) {
      if (!newRoleMap.has(currentRole.role_name)) {
        // Role no longer exists in new roles - mark for deletion
        rolesToDelete.push(currentRole);
      } else {
        // Compare skills to determine if update is needed
        const newRole = newRoleMap.get(currentRole.role_name);
        const currentSkills = new Set(currentRole.team_skill_requirements.map((s) => s.skill_name));
        const newSkills = new Set(newRole.skills_required || []);

        // Check if skills have changed
        const skillsChanged =
          currentSkills.size !== newSkills.size ||
          ![...currentSkills].every((skill) => newSkills.has(skill));

        if (skillsChanged) {
          rolesToUpdate.push({
            roleId: currentRole.id,
            currentSkills: [...currentSkills],
            newSkills: [...newSkills],
            members: currentRole.team.team_members,
          });
        }
      }
    }

    // Find completely new roles to add
    for (const newRole of newRoles) {
      if (!currentRoleMap.has(newRole.role_name)) {
        rolesToAdd.push(newRole);
      }
    }

    // Begin transaction for role updates
    const results = {
      deletedRoles: 0,
      updatedRoles: 0,
      addedRoles: 0,
      updatedSkills: 0,
    };

    // 1. Handle deletions first
    if (rolesToDelete.length > 0) {
      const roleIds = rolesToDelete.map((role) => role.id);
      const memberIdsToDelete = rolesToDelete
        .flatMap((role) => role.team.team_members)
        .map((member) => member.id);

      // Delete in correct order to maintain referential integrity
      if (memberIdsToDelete.length > 0) {
        await Hasura(deleteTeamMembers, { memberIds: memberIdsToDelete });
      }

      await Hasura(deleteRoleSkills, { roleIds });
      const deleteResponse = await Hasura(deleteRoles, { roleIds });
      results.deletedRoles = deleteResponse.result.data.delete_team_role_requirements.affected_rows;
    }

    // 2. Handle updates
    for (const roleUpdate of rolesToUpdate) {
      // Delete existing skills
      await Hasura(deleteRoleSkills, { roleIds: [roleUpdate.roleId] });

      // Add new skills
      if (roleUpdate.newSkills.length > 0) {
        const skillsData = roleUpdate.newSkills.map((skill) => ({
          role_requirement_id: roleUpdate.roleId,
          skill_name: skill,
        }));

        const updateResponse = await Hasura(addSkillsRequired, { objects: skillsData });
        results.updatedSkills +=
          updateResponse.result.data.insert_team_skill_requirements.affected_rows;
      }

      results.updatedRoles++;
    }

    // 3. Handle additions
    if (rolesToAdd.length > 0) {
      const roles_data = rolesToAdd.map((role) => ({
        team_id: teamId,
        role_name: role.role_name,
      }));

      const rolesResponse = await Hasura(addRolesRequired, { objects: roles_data });

      if (rolesResponse.success) {
        const skills_data = [];

        for (let i = 0; i < rolesToAdd.length; i++) {
          const role = rolesToAdd[i];
          const roleId = rolesResponse.result.data.insert_team_role_requirements.returning[i].id;

          if (role.skills_required && role.skills_required.length > 0) {
            for (const skill of role.skills_required) {
              skills_data.push({
                role_requirement_id: roleId,
                skill_name: skill,
              });
            }
          }
        }

        if (skills_data.length > 0) {
          const addSkillsResponse = await Hasura(addSkillsRequired, { objects: skills_data });
          results.updatedSkills +=
            addSkillsResponse.result.data.insert_team_skill_requirements.affected_rows;
        }

        results.addedRoles =
          rolesResponse.result.data.insert_team_role_requirements.returning.length;
      }
    }

    return {
      success: true,
      results,
      error: null,
    };
  } catch (error) {
    console.error('Error in handleRoleAndSkillUpdates:', error);
    return {
      success: false,
      results: null,
      error: error.message,
    };
  }
};

module.exports = handleRoleAndSkillUpdates;
