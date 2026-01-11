import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PhoneNumberInputProps {
  code: string;
  onCodeChange: (value: string) => void;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  selectClassName?: string;
  inputTestId?: string;
  selectTestId?: string;
}

export function PhoneNumberInput({
  code,
  onCodeChange,
  value,
  onChange,
  placeholder = "300 1234567",
  selectClassName = "w-28",
  inputTestId,
  selectTestId,
}: PhoneNumberInputProps) {
  return (
    <div className="flex gap-2">
      <Select value={code} onValueChange={onCodeChange}>
        <SelectTrigger className={selectClassName} data-testid={selectTestId}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="+92" className="text-foreground">
            +92
          </SelectItem>
          <SelectItem value="+91" className="text-foreground">
            +91
          </SelectItem>
          <SelectItem value="+1" className="text-foreground">
            +1
          </SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid={inputTestId}
      />
    </div>
  );
}
