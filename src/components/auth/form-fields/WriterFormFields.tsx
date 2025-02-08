
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface WriterFormFieldsProps {
  pseudonym: string;
  setPseudonym: (value: string) => void;
  bio: string;
  setBio: (value: string) => void;
}

export function WriterFormFields({
  pseudonym,
  setPseudonym,
  bio,
  setBio,
}: WriterFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="pseudonym">Pseudonym</Label>
        <Input
          id="pseudonym"
          type="text"
          placeholder="Enter your pen name"
          value={pseudonym}
          onChange={(e) => setPseudonym(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
        />
      </div>
    </>
  );
}
