import { Gem, Comment, Rating, Tag } from  "../../database/model.js";
import { Op } from 'sequelize';

const gemHandler = {
    getGem: async (req, res) => {
        const { gemId } = req.params;

        const gem = await Gem.findOne({
            where:{gemId: gemId},
            include: [{model: Comment}, {model: Rating}, {model:Tag}]
        }); 

        const enjoyRatings = gem.ratings.map((rating) => rating.enjoyability).filter((item) => item !== null);
        const popularRatings = gem.ratings.map((rating) => rating.popularity).filter((item) => item !== null);

        gem.enjoyAvg = Math.round(enjoyRatings.reduce((a, c) => a + c, 0) / enjoyRatings.length);
        gem.popularAvg = Math.round(popularRatings.reduce((a, c) => a + c, 0) / popularRatings.length);

        if (gem) {
            res.send({
                message: "Found gem",
                success: true,
                gem
            });
        } else {
            res.send({
                message: "Could not find gem",
                success: false
            })
        }
    },
    getAllGems: async (req, res) => {
        const gems = await Gem.findAll({
            include:[ { model: Rating }, { model: Tag }]
        });

        gems.forEach((gem) => {
            const enjoyRatings = gem.ratings.map((rating) => rating.enjoyability).filter((item) => item !== null);
            const popularRatings = gem.ratings.map((rating) => rating.popularity).filter((item) => item !== null);

            gem.enjoyAvg = Math.round(enjoyRatings.reduce((a, c) => a + c, 0) / enjoyRatings.length);
            gem.popularAvg = Math.round(popularRatings.reduce((a, c) => a + c, 0) / popularRatings.length);
        })

        if (gems) {
            res.send({
                message: "Found gem",
                success: true,
                gems: gems
            });
        } else {
            res.send({
                message: "Could not find gem",
                success: false
            })
        }
    },
    createGem: async (req, res) => {
        console.log("Hit createGem")
        const { name, description, imgUrl, lat, lng, tags  } = req.body;
        // Create a new record in the database
        let newGem = await Gem.create({
            name,
            description,
            imgUrl,
            lat,
            lng,
            userId: req.session.userId,

        });

        // now loop over 'tags' and query for each tag from the db, then connect it to 'newGem'
        for (const tag of tags) {
            let dbTag = await Tag.findByPk(tag)
            await newGem.addTag(dbTag)
        }

        console.log(imgUrl, 'lkasdlfkj')

        // need to re-query 'newGem' if you want to send it back including all Tag objects in relationship
        // because currently, 'newGem' is the value of its original query before we related the tags to it
        newGem = await Gem.findByPk(newGem.gemId, {
            include: Tag
        })

        // Send a success response back to the frontend
        res.send({
            message: "gem created",
            success: true,
            newGem: newGem
        })
    },
    getUserGems: async (req, res) => {
        const { userId } = req.params;

        const gems = await Gem.findAll({
            where: {
                userId: userId
            },
            include: { model: Rating }
        })

        gems.forEach((gem) => {
            const enjoyRatings = gem.ratings.map((rating) => rating.enjoyability).filter((item) => item !== null);
            const popularRatings = gem.ratings.map((rating) => rating.popularity).filter((item) => item !== null);

            gem.enjoyAvg = Math.round(enjoyRatings.reduce((a, c) => a + c, 0) / enjoyRatings.length);
            gem.popularAvg = Math.round(popularRatings.reduce((a, c) => a + c, 0) / popularRatings.length);
        });

        if (gems) {
            res.send({
                message: "Got gems for user",
                success: true,
                gems
            })
        } else {
            res.send({
                message: "Did not get gems for user",
                success: false
            })
        }
    },
    updateGem: async (req, res) => {
        const { gemId } = req.params;
        const { name, description, imgUrl, lat, lng, tags } = req.body; // Include 'tags' in the destructured request body
      
        try {
          // Authentication check
          if (!req.session.userId) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
          }
      
          // Find the gem
          const gem = await Gem.findByPk(gemId);
          if (!gem) {
            return res.status(404).json({ message: "Gem not found" });
          }
      
          // Authorization check
          if (gem.userId !== req.session.userId) {
            return res.status(403).json({ message: "Forbidden: You are not authorized to update this gem" });
          }
      
          // Update gem attributes
          await gem.update({
            name: name,
            description: description,
            imgUrl: imgUrl,
            lat: lat,
            lng: lng,
          });
      
          // Handle tags update
          if (Array.isArray(tags)) {
            // Assuming 'tags' is an array of tagIds
            await gem.setTags(tags); // This will replace existing tags with the new set
          }
      
          // You might want to refetch the gem to include updated tags in the response
          const updatedGem = await Gem.findByPk(gemId, {
            include: [{
              model: Tag
            }]
          });
      
          return res.status(200).json({ message: "Gem updated successfully", gem: updatedGem });
        } catch (error) {
          console.error("Error updating gem:", error);
          return res.status(500).json({ message: "Internal server error" });
        }
      },
      
    deleteGem: async (req, res) => {
        const { gemId } = req.params;
    
        try {
            // Check if the user is authenticated
            if (!req.session.userId) {
                return res.status(401).json({ message: "Unauthorized: User not logged in" });
            }
    
            // Find the gem by ID
            const gem = await Gem.findByPk(gemId);
    
            // Check if the gem exists
            if (!gem) {
                return res.status(404).json({ message: "Gem not found" });
            }
    
            // Check if the gem belongs to the logged-in user
            if (gem.userId !== req.session.userId) {
                alert('This is not your gem silly!'); // Add the alert here
                return res.status(403).json({ message: "Forbidden: You are not authorized to delete this gem" });
            }
    
            // Delete the gem
            await gem.destroy();
    
            return res.status(200).json({ message: "Gem deleted successfully" });
        } catch (error) {
            console.error("Error deleting gem:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    getAllTags: async (req, res) => {
        const tags = await Tag.findAll()

        res.send({
            message: "Here are all the tags",
            success: true,
            tags: tags
        })
    },
    searchGemsByName: async (req, res) => {
        try {
            const { query } = req.params;
            const gems = await Gem.findAll({
                where: {
                    name: {
                        [Op.iLike]: `%${query}%` // Case-insensitive search for gem names containing the query string
                    }
                },
                include: [{ model: Rating }, { model: Tag }]
            });

            if (!gems) {
                res.send({
                    message: "no gems found with that name",
                    success: false
                })
            }

            gems.forEach((gem) => {
                const enjoyRatings = gem.ratings.map((rating) => rating.enjoyability).filter((item) => item !== null);
                const popularRatings = gem.ratings.map((rating) => rating.popularity).filter((item) => item !== null);
    
                gem.enjoyAvg = Math.round(enjoyRatings.reduce((a, c) => a + c, 0) / enjoyRatings.length);
                gem.popularAvg = Math.round(popularRatings.reduce((a, c) => a + c, 0) / popularRatings.length);
            });

            if (gems) {
                res.status(200).json({
                    message: `Found ${gems.length} gems matching the search query`,
                    success: true,
                    gems
                });
            } else {
                res.status(404).json({
                    message: "No gems found matching the search query",
                    success: false
                });
            }
        } catch (error) {
            console.error("Error searching gems:", error);
            res.status(500).json({
                message: "Internal server error",
                success: false
            });
        }
    },
    getAllbyTags: async (req, res) => {
        const { tagId } = req.params; // Assuming tagId is sent as a parameter in the request
        
       
          // Find gems associated with the specified tagId
          const tag = await Tag.findByPk(tagId, {
            include: Gem
        })
        

        if (tag) {
            res.send({
                message: "Found gem",
                success: true,
                tag: tag,
            });
        } else {
            res.send({
                message: "Could not find gem",
                success: false
            })
        }
      },
      
}

export default gemHandler;