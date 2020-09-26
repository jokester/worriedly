import React from 'react';

export const ImagePicker: React.FC<{ onImage(b: Blob): void }> = (props) => {
  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.files && ev.target.files[0]) {
      props.onImage(ev.target.files[0]);
    }
  };
  return (
    <div>
      <div>
        capture:
        <input type="file" accept="image/*;capture=camera" capture onChange={onChange} />
      </div>
      <div>
        capture:
        <input type="file" accept="capture=camera" capture="user" onChange={onChange} />
      </div>
      <div>
        select:
        <input type="file" accept="image/*" onChange={onChange} />
      </div>
    </div>
  );
};
