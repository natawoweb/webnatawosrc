export interface Writer {
  id: string;
  name: string;
  bio: string;
  genre: string;
  level: string;
  image_url?: string;
  published_works?: Array<{
    title: string;
    year: string;
  }> | null;
  accomplishments?: string[] | null;
  social_links?: {
    [key: string]: string;
  } | null;
  created_at: string;
  featured: boolean;
  featured_month: string;
  country?: string;
  state?: string;
}
