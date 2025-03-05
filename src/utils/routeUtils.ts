
export const PUBLIC_ROUTES = [
  '/',
  '/auth',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/guidelines',
  '/events',
  '/blogs',
  '/search-writers', // Added this route as public
  '/forums',
  '/workshops',
  '/mentorship',
  '/book-clubs'
];

// Add event and blog detail routes as they're public too
export const PUBLIC_ROUTE_PATTERNS = [
  /^\/events\/[^/]+$/,  // Matches /events/:id
  /^\/blogs\/[^/]+$/,   // Matches /blogs/:id
  /^\/writer\/[^/]+$/   // Matches /writer/:id
];

export const isPublicRoute = (path: string): boolean => {
  // First check exact matches
  if (PUBLIC_ROUTES.includes(path)) {
    return true;
  }

  // Then check patterns
  return PUBLIC_ROUTE_PATTERNS.some(pattern => pattern.test(path));
};
