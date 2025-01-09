import { Router } from "express"
import { loginController, registerController } from "~/controllers/users.controllers"
import { loginValidator, registerValidator } from "~/middlewares/users.middlewares"

const usersRoute = Router()

usersRoute.get('/login', loginValidator, loginController)

/*
Description: Register new user
Path: /register
Method: Post
body:{
    name:            string
    emial:           string
    password:        string
    confirm_pasword: string
    date_of_birth:   string theo chuaant ISO 8601
    
}
*/
usersRoute.post('/register', registerValidator, registerController)

export default usersRoute