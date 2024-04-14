import { User } from  "../../database/model.js";

const imgHandler = {
    updateUserProfileImg: async (req, res) => {
        const { userId } = req.params;
        const { imgUrl } = req.body;

        try {
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send({
                    message: "User not found",
                    success: false,
                });
            }

            user.imgUrl = imgUrl;
            await user.save();

            res.send({
                message: "User profile image updated successfully",
                success: true,
                user,
            });
        } catch (error) {
            console.error('Error updating user profile image:', error);
            res.status(500).send({
                message: "Error updating user profile image",
                success: false,
            });
        }
    },
    updateUserHeaderImg: async (req, res) => {
        const { userId } = req.params;
        const { headerImgUrl } = req.body;
    
        try {
          const user = await User.findByPk(userId);
          if (!user) {
            return res.status(404).send({
              message: "User not found",
              success: false,
            });
          }
    
          user.headerImgUrl = headerImgUrl; // Assuming you have a field named headerImgUrl in your User model
          await user.save();
    
          res.send({
            message: "User header image updated successfully",
            success: true,
            user,
          });
        } catch (error) {
          console.error("Error updating user header image:", error);
          res.status(500).send({
            message: "Error updating user header image",
            success: false,
          });
        }
      }
}

export default imgHandler;