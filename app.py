from flask import Flask, render_template, request, jsonify
import io
import os
import speech_recognition as sr

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/recognize', methods=['POST'])
def recognize():
    audio_file = request.files['audio']

    # Convert the received audio file to a format compatible with SpeechRecognition
    with io.BytesIO() as converted_audio_file:
        audio_file.save(converted_audio_file)
        converted_audio_file.seek(0)
        recognizer = sr.Recognizer()
        with sr.AudioFile(converted_audio_file) as source:
            audio = recognizer.record(source)

    response = {"success": True, "error": None, "transcription": None}

    try:
        print("Google Speech Recognition thinks you said " + recognizer.recognize_google(audio))
        response["transcription"] = recognizer.recognize_google(audio)
        print("Google Speech Recognition thinks you said " + recognizer.recognize_google(audio))
    except sr.RequestError:
        response["success"] = False
        response["error"] = "API unavailable"
    except sr.UnknownValueError:
        response["error"] = "Unable to recognize speech"

    return response
    try:
        letters = recognizer.recognize_sphinx(audio, language="en-US")
    except sr.UnknownValueError:
        letters = "Sorry, could not understand the audio."
    except sr.RequestError as e:
        letters = f"Error: {e}"

    return jsonify({'letters': letters})

if __name__ == '__main__':
    app.run(debug=True)
