export interface TokenPayload {
  id: string;
  isAdmin?: boolean;
}

type JoseModule = typeof import("jose");

function getSecretKey() {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error("JWT_SECRET_KEY environment variable is missing!");
  }
  return new TextEncoder().encode(secret);
}

// TS commonjs output rewrites import() to require(); jose is ESM-only.
const loadJose = (): Promise<JoseModule> =>
  new Function('return import("jose")')() as Promise<JoseModule>;

export async function signToken(payload: { id: string; isAdmin?: boolean }): Promise<string> {
  const { SignJWT } = await loadJose();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyTokenValue(token: string): Promise<TokenPayload> {
  const { jwtVerify } = await loadJose();
  const { payload } = await jwtVerify(token, getSecretKey());

  if (typeof payload.id !== "string") {
    throw new Error("Invalid token payload");
  }

  return payload as unknown as TokenPayload;
}
