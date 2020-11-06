import { useFileInput } from '../components/hooks/use-file-input';
import React, { useEffect, useRef, useState } from 'react';

export const DecoderMultipleDemo: React.FC = () => {
  const [file, setFile] = useState<null | string>(null);
  const [inputElem, fileInput, fileInputRef] = useFileInput(
    {
      onFile(f: File) {
        setFile(URL.createObjectURL(f));
      },
    },
    { className: '' },
  );

  return (
    <div>
      <label>select a file {inputElem}</label>

      {file && <Demo baseImageUrl={file} />}
    </div>
  );
};

const Demo: React.FC<{ baseImageUrl: string }> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const imgRef = useRef<HTMLImageElement>(null!);

  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;

    img.src = props.baseImageUrl;

    img.onload = (ev) => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
    };
  }, []);

  const doDecodeAndConsume = () => {};

  return (
    <div>
      <img ref={imgRef} />
      <canvas ref={canvasRef} />
    </div>
  );
};
