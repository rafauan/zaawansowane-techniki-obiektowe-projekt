import React, { useEffect, useRef, useState } from "react";

type DropdownWrapperProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  children: React.ReactNode;
  emptyMessage?: string;
  tooltipMessage?: string;
};

const DropdownWrapper = <T,>({
  items,
  renderItem,
  children,
  emptyMessage,
  tooltipMessage,
}: DropdownWrapperProps<T>): React.ReactNode => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideTheDropdown = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        isDropdownOpen
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideTheDropdown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideTheDropdown);
    };
  }, [isDropdownOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="relative w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-gray-100 shadow-sm hover:shadow-md focus:outline-none"
        title={tooltipMessage}
        {...(tooltipMessage && {
          ["data-tooltip-target"]: `tooltip-${tooltipMessage}`,
        })}
      >
        {children}
      </button>

      {tooltipMessage && (
        <div
          id={`tooltip-${tooltipMessage}`}
          role="tooltip"
          className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        >
          {tooltipMessage}
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
      )}

      {isDropdownOpen && (
        <>
          <div className="absolute top-12 right-3 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200" />
          <div className="absolute top-14 right-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
            {items.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {items.map((item, index) => (
                  <li key={index}>
                    {renderItem(item, index)}
                    {index !== items.length - 1 && (
                      <div className="border-t border-gray-200 "></div>
                    )}
                  </li>
                ))}
              </ul>
            ) : emptyMessage ? (
              <div className="p-3 text-sm text-gray-500">{emptyMessage}</div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default DropdownWrapper;
