function cleanPostDoc(postDoc) {
    postDoc.project_likes = postDoc.project_likes.result.count;
    postDoc.has_liked = postDoc.has_liked.result.count == 1 ? true : false;

    return {
        ...postDoc,
        project_tags: postDoc.project_tags.map(post_tag => {
            return {
                name: post_tag.hashtag.name,
            };
        }),
    };
}

module.exports = cleanPostDoc;
