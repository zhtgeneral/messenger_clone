'use client'

import ReactSelect from "react-select";

interface SelectProps {
  disabled?: boolean;
  label: string;
  onChange: (value: Record<string, any>) => void;
  options: Record<string, any>[];
  value: Record<string, any>
}

/**
 * This component renders a selector that allows the user to select from a dropdown.
 * 
 * @param disabled optional determines if the select is displayed as diabled 
 * @param label the label of the select
 * @param onChange the behaviour of the select when an option is selected
 * @param options the set of possible values to select from
 * @param value the values that correspond to the selectable items
 * @returns component
 */
export default function Select({
  disabled,
  label,
  onChange,
  options,
  value,
}: SelectProps) {
  return (
    <div className="z-[100000]">
      <label className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div id='select' className="mt-2">
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={onChange}
          isMulti
          options={options}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 100000,
            }),
          }}
          classNames={{
            control: () => "text-sm",
          }}
        />
      </div>
    </div>
  );
};