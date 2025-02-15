import { SignJWT, jwtVerify, JWTPayload } from 'jose';  // Correct import for signing and verifying

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

// Generate token (using SignJWT for signing)
export const generateToken = async (payload: JWTPayload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })  // Specify the algorithm for signing
    .setExpirationTime('1h')  // Set expiration time for the token (1 hour)
    .sign(SECRET_KEY);  // Sign the JWT with the secret key
}

// Verify token
export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);  // Verify the token with the secret
    return payload;  // Return the payload if the token is valid
  } catch (error) {
    return null;  // Return null if the token verification fails
  }
}
