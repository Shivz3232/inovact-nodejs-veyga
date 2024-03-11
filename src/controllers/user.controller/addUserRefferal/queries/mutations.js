const addUserReferral = `mutation addUserReferral($userId: Int!, $referrerId: Int!) {
    insert_referrals(objects: [{user_id: $userId, referrer_id: $referrerId}]) {
        returning {
            id
        }
    }
}`;

module.exports = {
  addUserReferral,
}