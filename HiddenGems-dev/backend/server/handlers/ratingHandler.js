import { Rating } from  "../../database/model.js";

const ratingHandler = {
    createRating: async (req, res) => {
        if (req.session.userId) {
            const { enjoyability, popularity, gemId } = req.body

            if (enjoyability) {
                await Rating.create({
                    enjoyability,
                    gemId
                })
                res.send({
                    message: "Created enjoyability rating",
                    success: true
                })
                return;
            } else if (popularity) {
                await Rating.create({
                    popularity,
                    gemId
                })
                res.send({
                    message: "Created populatiry rating",
                    success: true
                })
                return;
            } else {
                res.send({
                    message: "failed to create rating",
                    success: false
                })
                return;
            }
        }
    },
    getRatingsAvg: async (req, res) => {
        console.log("hitting the backend")
        const { gemId } = req.params;

        const ratings = await Rating.findAll({
            where: {
                gemId: gemId
            }
        });

        let enjoyabilityAvg = [];
        let popularityAvg = [];

        ratings.forEach((rating) => {
            enjoyabilityAvg.push(rating.enjoyability);
            popularityAvg.push(rating.popularity);
        });

        enjoyabilityAvg = Math.round(enjoyabilityAvg.reduce((a, c) => a + c, 0) / enjoyabilityAvg.length);
        popularityAvg = Math.round(popularityAvg.reduce((a, c) => a + c, 0) / popularityAvg.length);

        const averages = { enjoyabilityAvg, popularityAvg }

        if (ratings) {
            res.send({
                message: "Retrieved all ratings",
                success: true,
                averages
            });
        } else {
            res.send({
                message: "Failed to retrieve ratings",
                success: true
            });
        }
    },
}

export default ratingHandler;