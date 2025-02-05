import { Request, Response, NextFunction } from "express";
import { omit } from "lodash";
import HTTP_STATUS from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Errors";

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // lỗi từ các nơi sẽ đổ dồn về nơi này 

    if(err instanceof ErrorWithStatus) {
        // omit dùng để bỏ các thuộc tính không cần
        res.status(err.status).json(omit(err, ['status']))
    }
    //  nếu mà lỗi xuống được đây thì nó là lỗi không phải mình tạo ra là nó kiểu throw new Error
    // mình sẽ phải set Name, message và enumerable về true
    Object.getOwnPropertyNames(err).forEach((key) => {
        Object.defineProperty(err, key, {enumerable: true})
    })
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: err.message,
        errorInfor: omit(err, ['stack']) // phải bỏ stake ra khỏi để khi hiện thị lỗi không hiên thị thông tin mật 
    })
}