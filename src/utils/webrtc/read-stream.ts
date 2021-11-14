export function stopVideo(v?: HTMLVideoElement) {
  const srcObject = v?.srcObject;
  if (srcObject) {
    v.pause();
    v.srcObject = null;
    if (srcObject instanceof MediaStream) {
      srcObject.getTracks().forEach((track) => track.stop());
    }
  }
}
