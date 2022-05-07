function cleanIdeaDoc(ideaDoc) {
    ideaDoc.idea_likes = ideaDoc.idea_likes.result.count;
    ideaDoc.has_liked = ideaDoc.has_liked.result.count == 1 ? true : false;

    return {
        ...ideaDoc,
        idea_tags: ideaDoc.idea_tags.map(idea_tag => {
            return {
                name: idea_tag.hashtag.name,
            };
        }),
    };
}

module.exports = cleanIdeaDoc;
