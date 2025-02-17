
export interface Writer {
  id: string;
  name: string;
  bio: string;
  genre: string;
  image_url?: string;
  published_works?: Array<{
    title: string;
    year: string;
  }>;
  accomplishments?: string[];
  social_links?: {
    [key: string]: string;
  };
}
