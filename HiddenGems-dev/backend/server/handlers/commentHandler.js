import { Comment } from  "../../database/model.js";

const commentHandler = {
    getComments: async (req, res) => {
        const { gemId } = req.params;

        const comments = await Comment.findAll({
            where: {
                gemId: gemId
            }
        });

        if (comments) {
            res.send({
                message: "Retrieved comments",
                success: true,
                comments
            });
        } else {
            res.send({
                message: "Failed to retrieve comments",
                success: false
            });
        }
    },

    createComment: async (req, res) => {
        if (req.session.userId) {
            const { comment } = req.body

            const { text, gemId } = comment;

            const newComment = await Comment.create({
                text,
                gemId,
                userId: req.session.userId
            })

            res.send({
                message: "comment created",
                success: true,
                newComment: newComment
            })
        } else {
            res.send({
                message: "comment NOT created",
                success: false,
            })
        }
    },



    deleteComment: async (req, res) => {
        const { commentId } = req.params;
        try {
            const deleted = await Comment.destroy({
                where: { commentId: commentId },
            });
            if (deleted) {
                return res
                    .status(200)
                    .send({ message: "Comment deleted successfully." });
            }
            return res.status(404).send({ message: "Comment not found." });
        } catch (error) {
            console.error("Error deleting comment:", error);
            return res.status(500).send({ message: "Error deleting comment." });
        }
    },
}

export default commentHandler;