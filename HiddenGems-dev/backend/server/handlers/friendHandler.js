import { User, Friendship, Gem, Rating, Tag } from  "../../database/model.js";
import { Op } from "sequelize";

const friendHandler = {
    getFriends: async (req, res) => {
        try {
            const userId = req.session.userId;
            if (!userId) {
                return res.status(401).send({ message: "User not authenticated" });
            }
    
            // Adjust this part to correctly match the alias used in your association definitions.
            // If 'Friendship' is the alias you've used, make sure the include statement below matches it.
            const userWithFriends = await User.findByPk(userId, {
                include: [{
                    model: User,
                    as: 'Friendship', // Adjust this alias to match the one used in your association definition.
                }]
            });
    
            if (userWithFriends && userWithFriends.Friendship) {
                res.send({
                    message: "Retrieved all of the friends for logged in user",
                    success: true,
                    friends: userWithFriends.Friendship
                });
            } else {
                res.status(404).send({
                    message: "Failed to retrieve friends for logged in user",
                    success: false
                });
            }
        } catch (error) {
            console.error("Error retrieving friends:", error);
            res.status(500).send({
                message: "Internal server error",
                success: false
            });
        }
    },
    
    
    getSearchResults: async (req, res) => {
        const { searchText } = req.params;

        const searchResults = await User.findAll({
            where: {
                email: {
                    [Op.iLike]: `%${searchText}%`
                }
            }
        });


        if (searchResults) {
            res.send({
                message: "Found search results for search query",
                success: true,
                searchResults
            });
            return;
        } else {
            res.send({
                message: "Did not find search results for search query",
                success: false
            });
        }
    },
    getGemsFromFriend: async (req, res) => {
        const { friendId } = req.params;

        const gems = await Gem.findAll({
            where: {
                userId: friendId
            },
            include: [{ model: Rating }, { model: Tag }]
        })

        gems.forEach((gem) => {
            const enjoyRatings = gem.ratings.map((rating) => rating.enjoyability).filter((item) => item !== null);
            const popularRatings = gem.ratings.map((rating) => rating.popularity).filter((item) => item !== null);

            gem.enjoyAvg = Math.round(enjoyRatings.reduce((a, c) => a + c, 0) / enjoyRatings.length);
            gem.popularAvg = Math.round(popularRatings.reduce((a, c) => a + c, 0) / popularRatings.length);
        });

        if (gems) {
            res.send({
                message: `Got friend ${friendId}'s gems`,
                success: true,
                gems
            });
        } else {
            res.send({
                message: `Did NOT get friends gems, or they did not have any created`,
                success: false
            });
        }
    }
}

export default friendHandler;