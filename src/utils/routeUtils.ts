
export const publicRoutes = ['/', '/auth', '/blogs', '/events', '/search', '/writer'];

export const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
};
