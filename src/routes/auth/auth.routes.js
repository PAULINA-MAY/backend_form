import { Router } from "express"
import { methods } from "../../controllers/auth/auth.controllers";
const {validateCreate, validateLogin} = require('../../validator/validator')

const router = Router();

router.post("/register",validateCreate, methods.registerUser);
router.post("/login", validateLogin,  methods.login )

export default router;