import React, { useMemo, useRef } from 'react';

export function useFileInput(
  callbacks?: { onFile?(f: File): void },
  extraProps?: React.HTMLAttributes<HTMLInputElement>,
) {
  const inputRef = useRef<HTMLInputElement>(null!);

  const inputElem = (
    <input
      type="file"
      ref={inputRef}
      onChange={(ev) => {
        if (ev.target.files?.length) {
          callbacks?.onFile?.(ev.target.files[0]);
        }
      }}
      {...extraProps}
    />
  );

  const operations = useMemo(
    () => ({
      open: () => inputRef.current?.click(),
    }),
    [],
  );

  return [inputElem, operations, inputRef] as const;
}
