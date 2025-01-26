// giả sử là đag làm 1 router login 
// thì người dùng sẽ truyền email và password 
// tạo 1 req có body là email và password

import { error } from "console"
import { Request, Response, NextFunction } from "express"
import { check, checkSchema } from "express-validator"
import { ErrorWithStatus } from "~/models/Errors"
import usersService from "~/services/users.services"
import { validate } from "~/utils/validation"

// làm 1 middleware kiểm tra xem email và password 
//  có được truyền lên hay không ?

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            error: 'Missing email or password'
        })
    }
    next()
} 

export const registerValidator = validate(
    checkSchema({
        name: {
            notEmpty: true,
            isString: true,
            trim: true,
            isLength: {
                options: {
                    min: 1,
                    max: 100
                }
            }
        },
        email: {
            notEmpty: true,
            isEmail: true,
            trim: true,
            custom: {
                options: async (value, { req }) => {
                    const isExit = await usersService.checkEmailExits(value)
                    if(isExit) {
                        throw new Error('Email already exists')
                    }
                    return true
                }
            }
        },
        password: {
            notEmpty: true,
            isString: true,
            isLength: {
                options: {                          
                    min: 8,
                    max: 50
                }
            },
            isStrongPassword: {
                options: {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                    returnScore: false
                }
            },
            errorMessage: 
                'Password must be at least 8 characters long or contain at least 1 lowercase letter or contain at least 1 uppercase letter or contain at least 1 number or contain at least 1 symbol'
       
        },
        confirm_password: {
            notEmpty: true,
            isString: true,
            isLength: {
                options: {
                    min: 8,
                    max: 50
                }
            },
            isStrongPassword: {
                options: {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                    returnScore: false
                }
            },
            errorMessage: 
                'Confirm_password must be at least 8 characters long or contain at least 1 lowercase letter or contain at least 1 uppercase letter or contain at least 1 number or contain at least 1 symbol',
            custom: {
                options: ( value, { req } ) => {
                    if(value !== req.body.password){
                        throw new Error('comfirm_password does not match password');
                    }
                    return true
                }
            }
        },
        date_of_birth: {
            isISO8601: {
                options: {
                    strict: true,
                    strictSeparator: true
                }
            }
        }
    })
)