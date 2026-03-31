import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET!

export function signToken(userId:string){
    return jwt.sign({userId}, SECRET ,{expiresIn:"7d"})
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, SECRET) as { userId: string }
    } catch (error) {
        return null
    }
}