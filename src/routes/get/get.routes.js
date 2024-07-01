import { Router } from "express"
import { getMethods } from "../../controllers/get/get.controllers";
const checkAuth = require('../../middleware/checkAuth')
const router = Router();

router.get("/getAllForms",  getMethods.getAllForms );
router.get("/getAllQuestions/:formId", getMethods.getAllQuestions );
router.get("/getResultsForm/:formId/:userId", checkAuth, getMethods.getResultsForm);


export default router;