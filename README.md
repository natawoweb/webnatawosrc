
# Project Technical Documentation

## Technologies Used

This project is built with modern web technologies:

### Frontend
- **Vite**: A modern build tool that offers a faster and leaner development experience
- **React**: A JavaScript library for building user interfaces
- **TypeScript**: Adds static typing to JavaScript for better development experience and code quality
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development
- **shadcn/ui**: A collection of reusable components built with Radix UI and Tailwind CSS
- **Tanstack Query**: For efficient server state management and data fetching
- **Lucide Icons**: A clean and consistent icon set
- **date-fns**: Modern JavaScript date utility library

### Backend & Infrastructure
- **Supabase**: Provides backend functionality including:
  - Authentication & Authorization
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Storage for file uploads
  - Edge Functions

## Key Features

- User authentication and authorization
- Role-based access control (Admin, Writer, Reader)
- User profile management with different levels:
  - Literary Experts
  - Aspiring Writers
  - NATAWO Volunteers
  - NATAWO Student Writers
  - Subscriber
  - Technical
  - General
  - Global Ambassador
- Blog management system
- Event management system
- Commenting and rating system
- Multi-language support
- Responsive design across all devices

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── hooks/         # Custom React hooks
├── integrations/  # External service integrations
├── lib/          # Utility functions and helpers
├── pages/        # Page components
└── types/        # TypeScript type definitions
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with necessary environment variables
4. Start development server: `npm run dev`

## Environment Variables

The following environment variables are required:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

The application can be built for production using:

```bash
npm run build
```

This will create a `dist` directory with the compiled assets ready for deployment.

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

