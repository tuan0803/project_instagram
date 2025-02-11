import { Router } from "express";
import  PasswordController  from "@controllers/auth/Passwords";

const route = Router();

route.put('/', PasswordController.update)

export default route;