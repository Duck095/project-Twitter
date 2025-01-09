import { Request, Response, NextFunction } from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'

// can be reused by many routes
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req)
    // hàm run trả ra promise nên cần có await ở trc 

    const result = validationResult(req)

    if (result.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: result.mapped() })
  }
}
