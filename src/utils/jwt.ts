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

// hàm nhận vào token và secretOrPublicKey?
export const verifyToken = ({
        token, 
        secretOrPublicKey = process.env.JWT_SECRET as string
    }: {
        token: string, 
        secretOrPublicKey?: string
    }
) => {
    return new Promise<Jwt.JwtPayload>((resolve, reject) => {
        Jwt.verify(token, secretOrPublicKey, (error, decoded) => {
            if(error) throw reject(error)
            resolve(decoded as Jwt.JwtPayload)
        })
    })
}


