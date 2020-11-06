import {
  DecodeHintType,
  BinaryBitmap,
  QRCodeReader,
  DetectorResult,
  BrowserQRCodeReader,
  DecoderResult,
  Result,
  BarcodeFormat,
  ResultMetadataType,
  HTMLCanvasElementLuminanceSource,
  HybridBinarizer,
} from '@zxing/library/esm';
import OrigDetector from '@zxing/library/esm/core/qrcode/detector/Detector';
import type FinderPatternInfo from '@zxing/library/esm/core/qrcode/detector/FinderPatternInfo';
import FinderPatternFinder from '@zxing/library/esm/core/qrcode/detector/FinderPatternFinder';
import Decoder from '@zxing/library/esm/core/qrcode/decoder/Decoder';
import QRCodeDecoderMetaData from '@zxing/library/esm/core/qrcode/decoder/QRCodeDecoderMetaData';

class Detector extends OrigDetector {
  public processFinderPatternInfo(info: FinderPatternInfo): DetectorResult {
    return super.processFinderPatternInfo(info);
  }
}

interface DecodeProgress {
  results: { position: never }[];
  finished: boolean;
}

function buildResult(detectorResult: DetectorResult, decoderResult: DecoderResult): Result {
  if (decoderResult.getOther() instanceof QRCodeDecoderMetaData) {
    (<QRCodeDecoderMetaData>decoderResult.getOther()).applyMirroredCorrection(detectorResult.getPoints());
  }

  const result = new Result(
    decoderResult.getText(),
    decoderResult.getRawBytes(),
    (undefined as any) as number,
    detectorResult.getPoints(),
    BarcodeFormat.QR_CODE,
    undefined,
  );
  const byteSegments: Array<Uint8Array> = decoderResult.getByteSegments();
  if (byteSegments !== null) {
    result.putMetadata(ResultMetadataType.BYTE_SEGMENTS, byteSegments);
  }
  const ecLevel: string = decoderResult.getECLevel();
  if (ecLevel !== null) {
    result.putMetadata(ResultMetadataType.ERROR_CORRECTION_LEVEL, ecLevel);
  }
  if (decoderResult.hasStructuredAppend()) {
    result.putMetadata(
      ResultMetadataType.STRUCTURED_APPEND_SEQUENCE,
      decoderResult.getStructuredAppendSequenceNumber(),
    );
    result.putMetadata(ResultMetadataType.STRUCTURED_APPEND_PARITY, decoderResult.getStructuredAppendParity());
  }
  return result;
}

function clearRecognized(prev: BinaryBitmap, consumed: DetectorResult): BinaryBitmap {
  throw 'TODO';
}

export function readCanvas(canvas: HTMLCanvasElement) {
  const luminanceSource = new HTMLCanvasElementLuminanceSource(canvas);
  const hybridBinarizer = new HybridBinarizer(luminanceSource);
  return new BinaryBitmap(hybridBinarizer);
}

export function* tryDecodeMultiple(
  browserReader: BrowserQRCodeReader,
  initialBitmap: BinaryBitmap,
): IterableIterator<DecodeProgress> {
  let finished = false;

  const hints = new Map([[DecodeHintType.TRY_HARDER, true]]);
  let prevResult = initialBitmap;

  for (let i = 0; i < 1; i++) {
    const detector = new Detector(prevResult.getBlackMatrix());
    const firstFinderPatternInfo = new FinderPatternFinder(prevResult.getBlackMatrix(), {
      foundPossibleResultPoint() {},
    }).find(hints);

    /**
     * points: resultPoint()
     */
    const detectorResult: DetectorResult = detector.processFinderPatternInfo(firstFinderPatternInfo);
    console.log('detectorResult', detectorResult);

    try {
      const decoderResult = new Decoder().decodeBitMatrix(detectorResult.getBits());
      console.log('decoderResult', decoderResult);

      const result = buildResult(detectorResult, decoderResult);
      console.log('result', result);
    } catch (wtf) {
      console.error('error', wtf);
      return;
    }
  }

  yield {
    finished,
    results: [],
  };
}

export class Reader extends BrowserQRCodeReader {
  static readImage(img: HTMLImageElement | HTMLVideoElement) {
    const reader = new this();
  }
}

export function* detectGreed(image: BinaryBitmap, hints?: Map<DecodeHintType, any>): Iterable<any> {
  const detector = new Detector(image.getBlackMatrix());
}
