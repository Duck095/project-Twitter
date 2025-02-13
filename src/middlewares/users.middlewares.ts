// giả sử là đag làm 1 router login 
// thì người dùng sẽ truyền email và password 
// tạo 1 req có body là email và password

import { error } from "console"
import { Request, Response, NextFunction } from "express"
import { check, checkSchema } from "express-validator"
import { USERS_MESSAGES } from "~/constants/messages"
import { ErrorWithStatus } from "~/models/Errors"
import databaseService from "~/services/database.services"
import usersService from "~/services/users.services"
import { hashPassword } from "~/utils/crypto"
import { validate } from "~/utils/validation"

// làm 1 middleware kiểm tra xem email và password 
//  có được truyền lên hay không ?

export const loginValidator = validate(checkSchema({
    email: {
        notEmpty: {
            errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
            errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
            options: async (value, { req }) => {
                // dựa vào email và password tìm đối tượng users tương ứng 
                const user = await databaseService.users.findOne({
                    email: value,
                    password: hashPassword(req.body.password)
                })

                if( user == null){
                    throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
                }

                req.user = user

                return true
            }
        }
    },
    password: {
        notEmpty: {
            errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
            errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
            options: {                          
                min: 8,
                max: 50
            },
            errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
        },
        isStrongPassword: {
            options: {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
                returnScore: false
            },
            errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
        }
    }
}))

export const registerValidator = validate(
    checkSchema({
        name: {
            notEmpty: {
                errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
            },
            isString: {
                errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
            },
            trim: true,
            isLength: {
                options: {
                    min: 1,
                    max: 100
                },
                errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
            }
        },
        email: {
            notEmpty: {
                errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
            },
            isEmail: {
                errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
            },
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
            notEmpty: {
                errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
            },
            isString: {
                errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
            },
            isLength: {
                options: {                          
                    min: 8,
                    max: 50
                },
                errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
            },
            isStrongPassword: {
                options: {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                    returnScore: false
                },
                errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
            }
        },
        confirm_password: {
            notEmpty: {
                errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
            },
            isString: {
                errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
            },
            isLength: {
                options: {
                    min: 8,
                    max: 50
                },
                errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
            },
            isStrongPassword: {
                options: {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                    returnScore: false
                },
                errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
            },
            custom: {
                options: ( value, { req } ) => {
                    if(value !== req.body.password){
                        throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD);
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
                },
                errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_BE_ISO8601
            }
        }
    })
)