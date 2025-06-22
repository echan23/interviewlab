import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type CompanySelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function CompanySelector({
  value,
  onChange,
}: CompanySelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select company" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value=" ">Any Company</SelectItem>
        <SelectItem value="meta">Meta</SelectItem>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="amazon">Amazon</SelectItem>
        <SelectItem value="netflix">Netflix</SelectItem>
        <SelectItem value="google">Google</SelectItem>
        <SelectItem value="microsoft">Microsoft</SelectItem>
        <SelectItem value="capitalone">Capital One</SelectItem>
        <SelectItem value="tiktok">TikTok</SelectItem>
        <SelectItem value="pinterest">Pinterest</SelectItem>
        <SelectItem value="doordash">DoorDash</SelectItem>
        <SelectItem value="uber">Uber</SelectItem>
      </SelectContent>
    </Select>
  );
}
