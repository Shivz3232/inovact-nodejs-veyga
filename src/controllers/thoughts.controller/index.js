const catchAsync = require('../../utils/catchAsync');
const cleanThoughtDoc = require('../../utils/cleanThoughtDoc');
const { query: Hasura } = require('../../utils/hasura');
const { getThought, getThoughts, getConnections } = require('./queries/queries');

const getAllThoughts = catchAsync(async (req, res) => {
    const id = await req.query.id;

    const response = await Hasura(getConnections, { cognito_sub: req.query.cognito_sub });

    if (!response.success) {
        return res.json(null, {
            success: false,
            errorCode: 'InternalServerError',
            errorMessage: 'Failed to find login user',
            data: null,
        });
    }

    const userId = response.result.data.user[0].id;

    const connections = {};
    response.result.data.connections.forEach(doc => {
        if (doc.user1 === userId) {
            connections[doc.user2] = doc.status;
        } else {
            connections[doc.user1] = doc.status;
        }
    });

    if (id) {
        const variables = {
            id,
            cognito_sub: req.query.cognito_sub,
        };

        const response1 = await Hasura(getThought, variables);

        if (!response1.success)
            return res.json(null, {
                success: false,
                errorCode: 'InternalServerError',
                errorMessage: JSON.stringify(response1.errors),
                data: null,
            });

        if (response1.result.data.thoughts.length == 0) {
            return res.json(null, {
                success: false,
                errorCode: 'NotFound',
                errorMessage: 'Thought not found',
                data: null,
            });
        }
        const cleanedThoughts = response1.result.data.thoughts.map(doc => {
            doc = cleanThoughtDoc(doc);
            doc.connections_status = connections[doc.user.id] ? connections[doc.user.id] : "not connected";
            return doc;
        });

        res.json(null, cleanedThoughts[0]);
    } else {
        const variables = {
            cognito_sub: req.query.cognito_sub,
        };

        const response = await Hasura(getThoughts, variables);

        if (!response.success) {
            return res.json(null, {
                success: false,
                errorCode: 'InternalServerError',
                errorMessage: JSON.stringify(response.errors),
                data: null,
            });
        }

        const cleanedThoughts = response.result.data.thoughts.map(doc => {
            doc = cleanThoughtDoc(doc);
            doc.connections_status = connections[doc.user.id] ? connections[doc.user.id] : "not connected";
            return doc;
        });

        res.json(null, cleanedThoughts);
    }
})

module.exports = {
    getAllThoughts,
}
