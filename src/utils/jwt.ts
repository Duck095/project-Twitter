import Jwt from "jsonwebtoken";

// làm hàm nhận vào payload, privateKey và option từ đó kí tên
export const signToken = ({
        payload, 
        privateKey = process.env.JWT_SECRET as string, 
        options = {algorithm: "HS256"}
    }: {   
        payload: string | object | Buffer, 
        privateKey?: string, 
        options: Jwt.SignOptions
    } 
) => {
    return new Promise<string>((resolve, reject) => {
        Jwt.sign(payload, privateKey, options, (err, token) => {
            if(err) throw reject(err)
                resolve(token as string)
        })
    })
}





