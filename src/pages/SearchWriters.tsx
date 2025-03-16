import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { WriterSearch } from '@/components/writers/WriterSearch';
import { WriterCard } from '@/components/writers/WriterCard';
import { WriterProfile } from '@/components/writers/WriterProfile';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import type { Writer } from '@/types/writer';

export default function SearchWriters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [searchCountry, setSearchCountry] = useState('All');
  const [selectedWriter, setSelectedWriter] = useState<Writer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const { toast } = useToast();
  const { t } = useLanguage();

  const { data: writers, isLoading } = useQuery({
    queryKey: ['writers', searchTerm, searchType, searchCountry],
    queryFn: async () => {
      try {
        let query = supabase.from('writers').select('*, profiles(*)');

        if (searchTerm) {
          switch (searchType) {
            case 'name':
              query = query.ilike('name', `%${searchTerm}%`);
              break;
            case 'genre':
              query = query.ilike('genre', `%${searchTerm}%`);
              break;
            case 'title':
              query = query.contains('published_works', [
                { title: searchTerm },
              ]);
              break;
          }
        }

        if (searchCountry && searchCountry !== 'All') {
          query = query
            .eq('profiles.county', searchCountry)
            .not('profiles', 'is', null);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching writers:', error);
          toast({
            variant: 'destructive',
            title: t('Error', 'பிழை'),
            description: t(
              'Failed to fetch writers. Please try again.',
              'எழுத்தாளர்களை பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'
            ),
          });
          throw error;
        }

        return data.map((writer) => ({
          id: writer.id,
          name: writer.name,
          bio: writer.bio,
          genre: writer.genre,
          level: writer.profiles?.level || 'General',
          image_url: writer.image_url,
          published_works: writer.published_works
            ? JSON.parse(writer.published_works as string)
            : null,
          accomplishments: writer.accomplishments
            ? JSON.parse(writer.accomplishments as string)
            : null,
          social_links: writer.social_links
            ? JSON.parse(writer.social_links as string)
            : null,
          created_at: writer.created_at,
          featured: writer.featured || false,
          featured_month: writer.featured_month || '',
          country: writer?.profiles?.county,
          state: writer?.profiles?.state,
        }));
      } catch (error) {
        console.error('Error in writers query:', error);
        toast({
          variant: 'destructive',
          title: t('Error', 'பிழை'),
          description: t(
            'An error occurred while fetching writers.',
            'எழுத்தாளர்களை பெறும்போது பிழை ஏற்பட்டது.'
          ),
        });
        throw error;
      }
    },
  });

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedWriters = writers?.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">
        {t('Search Writers', 'எழுத்தாளர்களைத் தேடுங்கள்')}
      </h1>

      <WriterSearch
        searchTerm={searchTerm}
        searchType={searchType}
        onSearchTermChange={setSearchTerm}
        onSearchTypeChange={setSearchType}
        setSearchCountry={setSearchCountry}
        searchCountry={searchCountry}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="col-span-full text-center">
            {t('Loading writers...', 'எழுத்தாளர்களை ஏற்றுகிறது...')}
          </p>
        ) : writers?.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">
            {t(
              'No writers found. Try adjusting your search.',
              'எழுத்தாளர்கள் எவரும் கிடைக்கவில்லை. உங்கள் தேடலை மாற்றி முயற்சிக்கவும்.'
            )}
          </p>
        ) : (
          paginatedWriters?.map((writer) => (
            <WriterCard
              key={writer.id}
              writer={writer}
              onSelect={setSelectedWriter}
            />
          ))
        )}
      </div>

      {writers && writers.length > 0 && (
        <div className="mt-6">
          <DataTablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={writers.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}

      <WriterProfile
        writer={selectedWriter}
        onClose={() => setSelectedWriter(null)}
      />
    </div>
  );
}
