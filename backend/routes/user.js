import express from "express"
import { editProfile, followOrUnfollow, getProfile, getSuggestedUser, login, logout, register } from "../controllers/user.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const UserRouter=express.Router();
UserRouter.route('/register').post(register);
UserRouter.route('/login').post(login);
UserRouter.route('/logout').get(logout);
UserRouter.route('/:id/profile').get(isAuthenticated, getProfile);
UserRouter.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'), editProfile);
UserRouter.route('/suggested').get(isAuthenticated, getSuggestedUser);
UserRouter.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);


export default UserRouter;
