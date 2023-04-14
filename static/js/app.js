const recordButton = document.getElementById('recordButton');
const stopButton = document.getElementById('stopButton');
const result = document.getElementById('result');

let recorder;

recordButton.addEventListener('click', async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  recorder = new RecordRTC(stream, { type: 'audio', mimeType: 'audio/webm' });
  recorder.startRecording();
  recordButton.disabled = true;
  stopButton.disabled = false;
});

stopButton.addEventListener('click', async () => {
  stopButton.disabled = true;
  recordButton.disabled = false;
  recorder.stopRecording(async () => {
    const blob = await recorder.getBlob();
    const formData = new FormData();
    formData.append('audio', blob);
    const response = await fetch('/recognize', { method: 'POST', body: formData });
    const data = await response.json();
    result.textContent = `Recognized letters: ${data.letters}`;
  });
});
