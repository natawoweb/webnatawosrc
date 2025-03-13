import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

interface WriterSearchProps {
  searchTerm: string;
  searchType: string;
  searchCountry: string;
  onSearchTermChange: (value: string) => void;
  onSearchTypeChange: (value: string) => void;
  setSearchCountry: (value: string) => void;
}

export function WriterSearch({
  searchTerm,
  searchType,
  onSearchTermChange,
  onSearchTypeChange,
  setSearchCountry,
  searchCountry,
}: WriterSearchProps) {
  const { t } = useLanguage();

  return (
    <div className="flex gap-4 mb-8">
      <Select value={searchType} onValueChange={onSearchTypeChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t('Search by...', 'தேடல் வகை...')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">{t('Name', 'பெயர்')}</SelectItem>
          <SelectItem value="genre">{t('Genre', 'இலக்கிய வகை')}</SelectItem>
          <SelectItem value="title">
            {t('Article Title', 'கட்டுரை தலைப்பு')}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select value={searchCountry} onValueChange={setSearchCountry}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Search by Country..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Countries</SelectItem>
          <SelectItem value="USA">USA</SelectItem>
          <SelectItem value="Canada">Canada</SelectItem>
          <SelectItem value="Mexico">Mexico</SelectItem>
          <SelectItem value="Others">Others</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder={t('Search writers...', 'எழுத்தாளர்களைத் தேடுங்கள்...')}
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="flex-1"
      />
    </div>
  );
}
