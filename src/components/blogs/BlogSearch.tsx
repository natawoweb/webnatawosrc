
import * as React from "react";
import { Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface BlogSearchProps {
  searchTerm: string;
  searchType: string;
  onSearchTermChange: (value: string) => void;
  onSearchTypeChange: (value: string) => void;
  dateFilter?: Date;
  onDateFilterChange: (value?: Date) => void;
  ratingFilter: string;
  onRatingFilterChange: (value: string) => void;
}

export function BlogSearch({
  searchTerm,
  searchType,
  onSearchTermChange,
  onSearchTypeChange,
  dateFilter,
  onDateFilterChange,
  ratingFilter,
  onRatingFilterChange,
}: BlogSearchProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 flex gap-2">
        <Select
          value={searchType}
          onValueChange={onSearchTypeChange}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={t("Search by", "தேடல் வகை")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">{t("Title", "தலைப்பு")}</SelectItem>
            <SelectItem value="author">{t("Author", "ஆசிரியர்")}</SelectItem>
            <SelectItem value="category">{t("Category", "வகை")}</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("Search blogs...", "பதிவுகளைத் தேடுங்கள்...")}
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={dateFilter ? "default" : "outline"}
              className="w-[140px]"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {dateFilter ? (
                format(dateFilter, "PP")
              ) : (
                t("Pick a date", "தேதியைத் தேர்வு செய்க")
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="single"
              selected={dateFilter}
              onSelect={onDateFilterChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select
          value={ratingFilter}
          onValueChange={onRatingFilterChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t("Filter by rating", "மதிப்பீட்டால் வடிகட்டு")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("All ratings", "அனைத்து மதிப்பீடுகள்")}</SelectItem>
            <SelectItem value="4">{t("4+ stars", "4+ நட்சத்திரங்கள்")}</SelectItem>
            <SelectItem value="3">{t("3+ stars", "3+ நட்சத்திரங்கள்")}</SelectItem>
            <SelectItem value="2">{t("2+ stars", "2+ நட்சத்திரங்கள்")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
