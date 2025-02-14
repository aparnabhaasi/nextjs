import { SignJWT, jwtVerify, JWTPayload } from 'jose'

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

// Generate token
export const generateToken = async (payload: JWTPayload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(SECRET_KEY)
}

// Verify token
export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload
  } catch {
    return null
  }
}
