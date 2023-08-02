const router = require('express').Router();
const teamsController = require('../../controllers/teams.controller');
const { acceptJoinRequestSanitizer, addTeamDocSanitizer, deleteMemberSanitizer, joinTeamSanitizer, rejectJoinRequestSanitizer, toggleAdminSanitizer } = require('../../controllers/teams.controller/sanitizer');

router.get('/', teamsController.getTeams);
router.post('/', teamsController.addTeam);
router.put('/', teamsController.updateTeam);
router.delete('/', teamsController.deleteTeam);

router.post('/documents', addTeamDocSanitizer, teamsController.addTeamDocument);

router.delete('/member', deleteMemberSanitizer, teamsController.deleteTeamMember);
router.post('/member/toggleAdmin', toggleAdminSanitizer, teamsController.toggleAdmin);

router.post('/invite', teamsController.inviteToTeam);
router.post('/invite/accept', teamsController.acceptInvite);
router.post('/invite/reject', teamsController.rejectInvite);

router.post('/request', joinTeamSanitizer, teamsController.joinTeam);
router.post('/request/accept', acceptJoinRequestSanitizer, teamsController.accepetJoinRequest);
router.post('/request/reject', rejectJoinRequestSanitizer, teamsController.rejectJoinRequest);
router.delete('/request', teamsController.withdrawRequest);

module.exports = router;
