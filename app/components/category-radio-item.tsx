import { useState } from "react";
import { RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";

export function CategoryRadioItem({
    category,
    selectedCategory,
    onSelect
}: {
    category: Category & { children?: Category[] };
    selectedCategory: number | undefined;
    onSelect: (categoryId: number | undefined) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="space-y-1">
            <div className="flex items-center space-x-2">
                <RadioGroupItem
                    value={category.id.toString()}
                    id={`category-${category.id}`}
                />
                <Label
                    htmlFor={`category-${category.id}`}
                    className="cursor-pointer flex-1"
                >
                    {category.title}
                </Label>
                {category.children && category.children.length > 0 && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </Button>
                )}
            </div>

            {isOpen && category.children && category.children.length > 0 && (
                <div className="ml-6 space-y-1 border-l pl-4">
                    {category.children.map((child) => (
                        <CategoryRadioItem
                            key={child.id}
                            category={child}
                            selectedCategory={selectedCategory}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}