export function requestUserMediaStream(constraint: MediaStreamConstraints): Promise<MediaStream> {
  return new Promise<MediaStream>((fulfill, reject) => navigator.getUserMedia(constraint, fulfill, reject));
}

export function stopVideo(v?: HTMLVideoElement) {
  const srcObject = v?.srcObject;
  if (v && srcObject) {
    v.pause();
    v.srcObject = null;
    if (srcObject instanceof MediaStream) {
      srcObject.getTracks().forEach((track) => track.stop());
    }
  }
}
