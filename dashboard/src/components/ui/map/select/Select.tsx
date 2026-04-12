import { Autocomplete, AutocompleteItem, Button } from "@heroui/react";
import { GrLocation } from "react-icons/gr";
import { FiTarget } from "react-icons/fi";

interface SearchProps {
  values: {
    value: string;
    label: string;
  }[];
  value: string;
  onChange: (value: string) => void;
  onClickButton: () => void;
  onSelect?: (value: string) => void;
}

export default function Search({
  values,
  value,
  onChange,
  onClickButton,
  onSelect,
}: SearchProps) {
  return (
    <div className="flex w-full items-center gap-2">
      <Autocomplete
        aria-label="Buscar ubicación"
        placeholder="Buscar dirección o lugar..."
        variant="bordered"
        startContent={<GrLocation className="text-default-400" />}
        inputValue={value}
        onInputChange={onChange}
        onSelectionChange={(key) => {
          if (key) onSelect?.(key as string);
        }}
        items={values}
        className="max-w-full"
        listboxProps={{
          emptyContent: "No se encontraron resultados",
        }}
        popoverProps={{
          offset: 10,
          placement: "bottom",
          shouldFlip: true,
          className: "z-[9999]", // Ensure it's above everything
        }}
      >
        {(item) => (
          <AutocompleteItem
            key={item.value}
            textValue={item.label}
            startContent={
              <div className="bg-primary/10 flex items-center justify-center rounded-full p-1.5">
                <GrLocation className="text-primary size-3" />
              </div>
            }
          >
            {item.label}
          </AutocompleteItem>
        )}
      </Autocomplete>

      <Button
        isIconOnly
        variant="flat"
        color="primary"
        size="lg"
        onPress={onClickButton}
        title="Usar mi ubicación"
        className="rounded-xl"
      >
        <FiTarget className="size-5" />
      </Button>
    </div>
  );
}
