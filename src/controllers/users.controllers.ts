import { Request, Response } from 'express'
import User from '~/models/schemas/User.chema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody  } from '~/models/requests/User.requests'

export const loginController = (req: Request, res: Response) => {
    const { email, password } = req.body 

    if (email == 'trungduc9564@gmail.com' && password == 'Trungduc09052004') {
        return res.json({
            message: 'Login successfully',
            result: [
                {name: 'Duck', yob: 2004},
                {name: 'Én', yob: 2007},
                {name: 'Love', yob: 2024}
            ]
        })   
    }
    return res.status(400).json({
        error: 'Login failed'
    })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
    const result = await usersService.register(req.body)
    res.json({
        message: 'register successfully',
        result
    })

}

