import React, { useMemo, useRef } from 'react';

export function useFileInput(
  callbacks?: { onFile?(f: File): void; onMultipleFile?(fileList: FileList): void },
  extraProps?: Exclude<React.InputHTMLAttributes<HTMLInputElement>, 'ref' | 'type'>,
) {
  const inputRef = useRef<HTMLInputElement>(null!);

  const inputElem = (
    <input
      type="file"
      ref={inputRef}
      onChange={(ev) => {
        const numFiles = ev.target.files?.length;
        if (numFiles === 1) {
          callbacks?.onFile?.(ev.target.files![0]);
        } else if (numFiles && numFiles > 1) {
          callbacks?.onMultipleFile?.(ev.target.files!);
        }
      }}
      {...extraProps}
    />
  );

  const operations = useMemo(
    () => ({
      open: () => inputRef.current?.click() as void,
      clear: () => void (inputRef.current && (inputRef.current.value = '')),
    }),
    [],
  );

  return [inputElem, operations, inputRef] as const;
}

export function useHiddenAnchor(extraProps: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const aRef = useRef<HTMLAnchorElement>(null!);

  const operations = {
    download: () => {
      console.debug('download', extraProps, aRef.current);
      if (extraProps.download && extraProps.href && aRef.current) {
        aRef.current.click();
      }
    },
  } as const;

  const aElem = <a ref={aRef} {...extraProps} />;

  return [aElem, operations, aRef] as const;
}
