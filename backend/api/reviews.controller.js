import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {
    // controller method to post a review
    static async apiPostReview(req, res, next) {
        try {
            const restaurantId = req.body.restaurant_id;
            const review = req.body.text;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id,
            };
            const date = new Date();

            const reviewResponse = await ReviewsDAO.addReview(
                restaurantId,
                userInfo,
                review,
                date
            );

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    // controller method to update a review
    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.body.review_id;
            const userId = req.body.user_id;
            const text = req.body.text;
            const date = new Date();

            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                userId,
                text,
                date
            );

            // check for errors
            const { error } = reviewResponse;
            if (error) {
                res.status(400).json({ error });
            }

            // if no review was modified
            if (reviewResponse.modifiedCount === 0) {
                throw new Error(
                    "Unable to update review - user may not be original poster"
                );
            }

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    // controller method to delete a review
    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.query.id;
            const userId = req.body.user_id;

            const reviewResponse = await ReviewsDAO.deleteReview(
                reviewId,
                userId
            );

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}
