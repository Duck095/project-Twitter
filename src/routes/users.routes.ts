import { Router } from "express"
import { loginController, registerController } from "~/controllers/users.controllers"
import { loginValidator, registerValidator } from "~/middlewares/users.middlewares"
import { wrapAsync } from "~/utils/handlers"

const usersRoute = Router()

/*
des: đăng nhập
path: /users/login
method: POST
body: {email, password}
*/
usersRoute.get('/login', loginValidator, wrapAsync(loginController))

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

usersRoute.post('/register', registerValidator, wrapAsync(registerController))

export default usersRoute