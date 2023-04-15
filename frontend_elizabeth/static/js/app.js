const recordButton = document.getElementById('recordButton');
const stopButton = document.getElementById('stopButton');
const playButton = document.getElementById('playButton');
const result = document.getElementById('result');
const wordImage = document.getElementById('wordImage');
const wordIndex = document.getElementById('wordIndex');



let socket = new WebSocket("wss://javascript.info/article/websocket/demo/hello");

socket.onopen = function(e) {
  alert("[open] Connection established");
  alert("Sending to server");
  socket.send("My name is John");
};

socket.onmessage = function(event) {
  alert(`[message] Data received from server: ${event.data}`);
};

socket.onclose = function(event) {
  if (event.wasClean) {
    alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    alert('[close] Connection died');
  }
};

socket.onerror = function(error) {
  alert(`[error]`);
};


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

export function cardclicked(name){
  alert("card clicked"+name);
}

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
      if (currentWordIndex >= wordList.length) {
        currentWordIndex = 0;
      }
      const cardContainer = document.querySelector('.card-container');

      // Define an array of objects representing the cards
      const cards = [
        { letter: 'A', imageSrc: 'a.jpg', word: 'Apple', description: 'This is a delicious fruit' },
        { letter: 'B', imageSrc: 'b.jpg', word: 'Ball', description: 'This is a spherical object' },
        // Add more objects for each letter of the alphabet, with the image source, word, and description
      ];
      
      // Shuffle the cards randomly
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
      
      // Add the cards to the card container
      cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.innerHTML = `
          <img src="${card.imageSrc}" alt="${card.word}">
          <h2>${card.letter} is for ${card.word}</h2>
          <div class="card-back">${card.description}</div>
        `;
        cardContainer.appendChild(cardElement);
      
//----FOR RESULTS PAGE

        const word = 'ASTRONAUT'; // Replace with the word you want to use
const wordContainer = document.querySelector('#word-container');

// Define an array of objects representing the word letters
const wordLetters = word.split('').map(letter => ({
  letter,
  correct: Math.random() >= 0.5, // Replace with your pronunciation metric for each letter
}));

// Add the letters to the word container
wordLetters.forEach(letter => {
  const letterElement = document.createElement('div');
  letterElement.classList.add('letter-bubble');
  letterElement.textContent = letter.letter;
  if (letter.correct) {
    letterElement.classList.add('correct');
    letterElement.textContent += ' ✓';
  } else {
    letterElement.classList.add('incorrect');
    letterElement.textContent += ' ✕';
  }
  wordContainer.appendChild(letterElement);
});
