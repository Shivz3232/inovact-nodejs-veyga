const addUserReferral = `mutation addUserReferral($userId: Int!, $referrerId: Int!) {
    insert_referrals(objects: [{user_id: $userId, referrer_id: $referrerId}]) {
        returning {
            id
            user_id
            referrer_id
            created_at
            updated_at
        }
    }
}`;

module.exports = {
  addUserReferral,
}