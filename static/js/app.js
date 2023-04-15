const recordButton = document.getElementById('recordButton');
const stopButton = document.getElementById('stopButton');
const playButton = document.getElementById('playButton');
const result = document.getElementById('result');
const wordImage = document.getElementById('wordImage');
const wordIndex = document.getElementById('wordIndex');

let recorder;
let isRecording = false;
let correctAttempts = 0;
let incorrectAttempts = 0;
let wordList = [
  {
    imageSrc: "/static/images/cat.png",
    word: "cat"
  },
  {
    imageSrc: "/static/images/dog.png",
    word: "dog"
  },
  {
    imageSrc: "/static/images/bird.png",
    word: "bird"
  }
];
let currentWordIndex = 0;
let currentWord = wordList[currentWordIndex];

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
      checkWordPronunciation(data.letters);
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

function checkWordPronunciation(letters) {
  if (letters.toLowerCase() === currentWord.word) {
    correctAttempts++;
    result.textContent += " - Correct!";
    if (correctAttempts === 3) {
      incorrectAttempts = 0;
      correctAttempts = 0;
      currentWordIndex++;
      if (currentWordIndex >= wordList.length) {
        currentWordIndex = 0;
      }
      currentWord = wordList[currentWordIndex];
      wordIndex.textContent = `Word ${currentWordIndex + 1} / ${wordList.length}`;
      wordImage.src = currentWord.imageSrc;
      result.textContent = "";
      recordButton.textContent = "Try it!";
      playButton.disabled = true;
    }
  } else {
    incorrectAttempts++;
    result.textContent += " - Incorrect. Please try again.";
    if (incorrectAttempts >= 5) {
      incorrectAttempts = 0;
      correctAttempts = 0;
      currentWordIndex++;
      if (currentWord