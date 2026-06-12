export function isCrossSiteDeployment(): boolean {
  return (
    process.env.FRONTEND_URL?.startsWith("https://") === true &&
    process.env.BACKEND_URL?.startsWith("https://") === true
  );
}

export function getAuthCookieOptions(maxAge: number) {
  const crossSite = isCrossSiteDeployment();

  return {
    httpOnly: true,
    secure: crossSite || process.env.NODE_ENV === "production",
    sameSite: crossSite ? ("none" as const) : ("lax" as const),
    path: "/",
    maxAge,
  };
}
