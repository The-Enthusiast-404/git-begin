import { Form } from "@remix-run/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FilterFormProps = {
  minStars: string;
  maxStars: string;
  language: string;
  isAssigned: boolean;
  isLoading: boolean;
  onMinStarsChange: (value: string) => void;
  onMaxStarsChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onIsAssignedChange: (value: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function FilterForm({
  minStars,
  maxStars,
  language,
  isAssigned,
  isLoading,
  onMinStarsChange,
  onMaxStarsChange,
  onLanguageChange,
  onIsAssignedChange,
  onSubmit,
}: FilterFormProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Filter Issues</CardTitle>
      </CardHeader>
      <CardContent>
        <Form method="get" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label htmlFor="minStars" className="text-sm font-medium">
                Min Stars
              </label>
              <Input
                type="number"
                id="minStars"
                name="minStars"
                value={minStars}
                onChange={(e) => onMinStarsChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="maxStars" className="text-sm font-medium">
                Max Stars
              </label>
              <Input
                type="number"
                id="maxStars"
                name="maxStars"
                value={maxStars}
                onChange={(e) => onMaxStarsChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="language" className="text-sm font-medium">
                Language
              </label>
              <Input
                type="text"
                id="language"
                name="language"
                value={language}
                onChange={(e) => onLanguageChange(e.target.value)}
                placeholder="e.g. JavaScript"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAssigned"
                name="isAssigned"
                checked={isAssigned}
                onCheckedChange={(checked) =>
                  onIsAssignedChange(checked as boolean)
                }
              />
              <label
                htmlFor="isAssigned"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include Assigned Issues
              </label>
            </div>
          </div>
          <Button type="submit" className="mt-4" disabled={isLoading}>
            {isLoading ? "Filtering..." : "Filter"}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
