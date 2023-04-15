const recordButton = document.getElementById('recordButton');
const stopButton = document.getElementById('stopButton');
const playButton = document.getElementById('playButton');
const result = document.getElementById('result');

let recorder;
let isRecording = false;

recordButton.addEventListener('click', async () => {
  if (!isRecording) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new RecordRTC(stream, { type: 'audio', mimeType: 'audio/webm' });
    recorder.startRecording();
    recordButton.textContent = 'Done';
    stopButton.disabled = false;
    isRecording = true;
  } else {
    stopRecording();
    recordButton.textContent = 'Play it back';
    playButton.disabled = false;
  }
});

stopButton.addEventListener('click', async () => {
  stopRecording();
  recordButton.textContent = 'Play it back';
  playButton.disabled = false;
});

playButton.addEventListener('click', () => {
  playRecordedAudio();
});

async function stopRecording() {
  if (isRecording) {
    isRecording = false;
    stopButton.disabled = true;
    recordButton.textContent = 'Play it back';
    recorder.stopRecording(async () => {
      const blob = await recorder.getBlob();
      recordedAudioBlob = blob;
      playButton.disabled = false;
      const formData = new FormData();
      formData.append('audio', blob);
      const response = await fetch('/recognize', { method: 'POST', body: formData });
      const data = await response.json();
      result.textContent = `Recognized letters: ${data.letters}`;
    });
  }
}

let recordedAudioBlob = null;

function playRecordedAudio() {
  if (recordedAudioBlob) {
    const audio = new Audio(URL.createObjectURL(recordedAudioBlob));
    audio.play();
  } else {
    alert('No recorded audio available.');
  }
}
