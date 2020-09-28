import React from 'react';

export const FilePicker: React.FC<{ onFile?(file: File): void; className?: string }> = (props) => {
  return (
    <input
      className={props.className}
      type="file"
      onChange={(ev) => {
        if (ev.target.files?.length) {
          props.onFile?.(ev.target.files[0]);
        }
      }}
    />
  );
};
