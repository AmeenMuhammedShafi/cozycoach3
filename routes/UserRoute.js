import express from "express" ;
import UserController from "../controllers/UserController.js" ;

const router = express.Router() ;

router.post('/init',UserController.initUser);

export default router ;