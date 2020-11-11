'use strict';

const {Comment} = require(`../models`);
const {dateFormat} = require(`../../utils`);

class CommentService {
  async create(offer, comment) {
    const newComment = await Comment.create({
      text: comment,
      created: dateFormat(new Date(), `%Y-%m-%d %H:%M:%S`),
      offerId: offer,
      /* todo get user_id */
      userId: 1,
    });

    return newComment.toJSON();
  }

  async drop(commentId) {
    const deletedCommentsCount = await Comment.destroy({
      where: {commentId}
    });

    return !!deletedCommentsCount;
  }

  async findAll(offer) {
    const comments = await Comment.findAll({
      where: {
        offerId: offer
      },
      raw: true
    });
    return comments;
  }
}

module.exports = CommentService;
