const router = require('express').Router();

const teamsController = require('../../controllers/teams.controller');

router.get('/', teamsController.getTeams);
router.post('/', teamsController.addTeam);
router.put('/', teamsController.updateTeam);
router.delete('/', teamsController.deleteTeam);

router.post('/document', teamsController.addTeamDocument);

router.delete('/member', teamsController.deleteTeamMember);
router.post('/member/toggleAdmin', teamsController.toggleAdmin);

router.post('/invite', teamsController.inviteToTeam);
router.post('/invite/accept', teamsController.acceptInvite);
router.post('/invite/reject', teamsController.rejectInvite);

router.post('/request', teamsController.joinTeam);
router.post('/request/accept', teamsController.accepetJoinRequest);
router.post('/request/reject', teamsController.rejectJoinRequest);
router.delete('/request', teamsController.withdrawRequest);

module.exports = router;
