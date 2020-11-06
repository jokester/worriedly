import { useFileInput } from '../components/hooks/use-file-input';
import React, { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';
import { readCanvas, tryDecodeMultiple } from '../../core/model/decode-multiple-qr';

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

      {file && <Demo key={file} baseImageUrl={file} />}
    </div>
  );
};

const Demo: React.FC<{ baseImageUrl: string }> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const imgRef = useRef<HTMLImageElement>(null!);

  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!(img && canvas && ctx)) return;

    img.src = props.baseImageUrl;

    img.onload = (ev) => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
    };
  }, []);

  const doDecodeAndConsume = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;

    if (!(img && canvas)) return;

    for (const q of tryDecodeMultiple(new BrowserQRCodeReader(), readCanvas(canvas))) {
    }
  };

  return (
    <div>
      <button onClick={doDecodeAndConsume}>doSomething()</button>
      <img ref={imgRef} className="w-full h-full" />
      <canvas ref={canvasRef} />
    </div>
  );
};
