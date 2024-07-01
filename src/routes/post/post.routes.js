import { Router } from "express"
import { postMethods } from "../../controllers/post/post.controllers";
const checkAuth = require('../../middleware/checkAuth')

const router = Router();

router.post("/addForm/:id", postMethods.addform);
router.post("/addQuestion/:id", postMethods.addQuestion);
router.post("/addOption/:id",  postMethods.addOption);
router.post("/addAnswer", postMethods.addAnswer);
export default router;