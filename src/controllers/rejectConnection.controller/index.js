const catchAsync = require('../../utils/catchAsync');
const { query: Hasura } = require('../../utils/hasura');
const {
    getUserId,
    getPendingConnection,
    deleteConnection,
} = require('./queries/queries');

const rejectConnection = catchAsync(async (req, res) => {
    const user_id = req.query.user_id;

    // Find user id
    const cognito_sub = req.query.cognito_sub;
    const response1 = await Hasura(getUserId, {
        cognito_sub: { _eq: cognito_sub },
    });

    if (!response1.success)
        return res.json(null, {
            success: false,
            errorCode: 'InternalServerError',
            errorMessage: JSON.stringify(response1.errors),
            data: null,
        });

    // Fetch connection
    const variables = {
        user2: response1.result.data.user[0].id,
        user1: user_id,
    };

    const response2 = await Hasura(getPendingConnection, variables);

    if (!response2.success)
        res.json(null, {
            success: false,
            errorCode: 'InternalServerError',
            errorMessage: JSON.stringify(response2.errors),
            data: null,
        });

    const response3 = await Hasura(deleteConnection, variables);

    if (!response3.success)
        res.json(null, {
            success: false,
            errorCode: 'InternalServerError',
            errorMessage: JSON.stringify(response3.errors),
            data: null,
        });

    res.json(null, {
        success: true,
        errorCode: '',
        errorMessage: '',
        data: null,
    });
});

module.exports = {
    rejectConnection,
}