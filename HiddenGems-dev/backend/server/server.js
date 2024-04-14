import ViteExpress from "vite-express";
import session from "express-session";
import express from "express";
import morgan from "morgan";
import dotenv from 'dotenv'

// Handlers
import userHandler from "./handlers/userHandler.js";
import friendHandler from "./handlers/friendHandler.js";
import gemHandler from "./handlers/gemHandler.js";
import imgHandler from "./handlers/imgHandler.js";
import ratingHandler from "./handlers/ratingHandler.js";
import commentHandler from "./handlers/commentHandler.js";

// Server Boilerplate
dotenv.config()
const app = express();

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "secretKey",
    saveUninitialized: false,
    resave: false,
  })
);
app.use(express.static('public'));

// Routes

// User Routes
app.get('/session-check', userHandler.sessionCheck);
app.get("/logout", userHandler.logout);
app.get("/getUser/:userId", userHandler.getUser);
app.get("/getUserInfo/:userId", userHandler.getUserInfo);

app.post("/login", userHandler.login);
app.post("/register", userHandler.register);
app.post("/followUser/:idToFollow", userHandler.followUser);

app.put("/saveColors", userHandler.saveColors)

app.delete("/unfollowUser/:idToUnfollow", userHandler.unfollowUser)

// Friends/Following Routes
app.get("/getFriends", friendHandler.getFriends);
app.get("/getSearchResults/:searchText", friendHandler.getSearchResults);
app.get("/getFollowingGems/:friendId", friendHandler.getGemsFromFriend)

// Gem Routes
app.get("/getGem/:gemId", gemHandler.getGem);
app.get("/getAllGems", gemHandler.getAllGems);
app.get("/getGemsFromUserId/:userId", gemHandler.getUserGems);
app.get("/getAllTags", gemHandler.getAllTags);
app.get("/getAllByTag/:tagId", gemHandler.getAllbyTags)
app.get("/searchGems/:query", gemHandler.searchGemsByName);

app.post("/createGem", gemHandler.createGem);

app.put("/updateGem/:gemId", gemHandler.updateGem);


app.delete("/deleteGem/:gemId", gemHandler.deleteGem);

// Img Routes
app.put('/updateUserProfileImg/:userId', imgHandler.updateUserProfileImg);
app.put('/updateUserHeaderImg/:userId', imgHandler.updateUserHeaderImg);

// Ratings Routes
app.get("/getRatings/:gemId", ratingHandler.getRatingsAvg);

app.post("/createRating", ratingHandler.createRating);

// Comments Routes
app.get("/getComments/:gemId", commentHandler.getComments);

app.post("/createComment", commentHandler.createComment);

app.delete('/deleteComment/:commentId', commentHandler.deleteComment);

// Server Startup
const port = 9998;
ViteExpress.listen(app, port, () => console.log(`Server started up at: http://localhost:${port}`));
