import { error } from 'console'
import { Request, Response, NextFunction } from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

// can be reused by many routes
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req)
    // hàm run trả ra promise nên cần có await ở trc 

    const errors = validationResult(req)

    if (errors.isEmpty()) {
      return next();
    }

    const errorObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })
    // xử lý errorObject
    for(const key in errorObject) {
      // phân rã lấy từng msg của từng cái lỗi
      const {msg} = errorObject[key]
      // nếu mà msg có dạng là ErrorWithStatus và status !== 422 thì ném cho default error handler
      if (msg instanceof ErrorWithStatus && msg.status !== 422) {
        return next(msg)
      }

      // lưu các lỗi 422 từ errorObject vào entityError
      entityError.errors[key] = msg 
    }


    // ở đây nó xử lý lỗi luôn
    // chứ không mén về error handler tổng
    next(entityError)
  }
}
