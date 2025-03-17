/* eslint-disable @typescript-eslint/no-explicit-any */

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface ProfileFormProps {
  editedProfile: any;
  onProfileChange: (field: string, value: any) => void;
  onSocialLinkChange: (platform: string, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const countryStates = {
  USA: [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming',
  ],
  Canada: [
    'Alberta',
    'British Columbia',
    'Manitoba',
    'New Brunswick',
    'Newfoundland and Labrador',
    'Northwest Territories',
    'Nova Scotia',
    'Nunavut',
    'Ontario',
    'Prince Edward Island',
    'Quebec',
    'Saskatchewan',
    'Yukon',
  ],
  Mexico: [
    'Aguascalientes',
    'Baja California',
    'Baja California Sur',
    'Campeche',
    'Chiapas',
    'Chihuahua',
    'Coahuila',
    'Colima',
    'Durango',
    'Guanajuato',
    'Guerrero',
    'Hidalgo',
    'Jalisco',
    'Mexico City',
    'Mexico State',
    'Michoacán',
    'Morelos',
    'Nayarit',
    'Nuevo Leon',
    'Oaxaca',
    'Puebla',
    'Querétaro',
    'Quintana Roo',
    'San Luis Potosí',
    'Sinaloa',
    'Sonora',
    'Tabasco',
    'Tamaulipas',
    'Tlaxcala',
    'Veracruz',
    'Yucatán',
    'Zacatecas',
  ],
};

export function ProfileForm({
  editedProfile,
  onProfileChange,
  onSocialLinkChange,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  const [state, setState] = useState('');
  const [county, setCounty] = useState('');

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          type="text"
          value={editedProfile?.full_name || ''}
          onChange={(e) => onProfileChange('full_name', e.target.value)}
          placeholder="Enter your full name"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="county">Country</Label>
        <Select
          value={editedProfile?.county || county}
          onValueChange={(value) => {
            onProfileChange('county', value);
            setCounty(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USA">USA</SelectItem>
            <SelectItem value="Canada">Canada</SelectItem>
            <SelectItem value="Mexico">Mexico</SelectItem>
            <SelectItem value="Others">Others</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(editedProfile?.county || county) in countryStates && (
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select
            value={editedProfile?.state || state}
            onValueChange={(value) => {
              onProfileChange('state', value);
              setState(value);
            }}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent>
              {countryStates[editedProfile?.county].map((state: string) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="pseudonym">Pseudonym</Label>
        <Input
          id="pseudonym"
          type="text"
          value={editedProfile?.pseudonym || ''}
          onChange={(e) => onProfileChange('pseudonym', e.target.value)}
          placeholder="Enter your pseudonym"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date_of_birth">Date of Birth</Label>
        <Input
          id="date_of_birth"
          type="date"
          value={editedProfile?.date_of_birth || ''}
          onChange={(e) => onProfileChange('date_of_birth', e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select
          value={editedProfile?.gender || ''}
          onValueChange={(value) => onProfileChange('gender', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={editedProfile?.bio || ''}
          onChange={(e) => onProfileChange('bio', e.target.value)}
          placeholder="Tell us about yourself"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-4">
        <Label>Social Media Links</Label>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              type="url"
              value={editedProfile?.social_links?.twitter || ''}
              onChange={(e) => onSocialLinkChange('twitter', e.target.value)}
              placeholder="https://twitter.com/username"
            />
          </div>
          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              type="url"
              value={editedProfile?.social_links?.facebook || ''}
              onChange={(e) => onSocialLinkChange('facebook', e.target.value)}
              placeholder="https://facebook.com/username"
            />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              type="url"
              value={editedProfile?.social_links?.instagram || ''}
              onChange={(e) => onSocialLinkChange('instagram', e.target.value)}
              placeholder="https://instagram.com/username"
            />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              type="url"
              value={editedProfile?.social_links?.linkedin || ''}
              onChange={(e) => onSocialLinkChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" className="flex-1">
          Update Profile
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
