import speech_recognition as sr
import time

def break_word_into_sounds(word):
    vowels = ['a', 'e', 'i', 'o', 'u']
    sounds = []
    i = 0

    while i < len(word):
        if word[i] in vowels:
            sounds.append(word[i])
            i += 1
        else:
            if i < len(word) - 1 and word[i + 1] not in vowels:
                sounds.append(word[i:i + 2])
                i += 2
            else:
                sounds.append(word[i])
                i += 1

    return sounds

def recognize_speech_from_mic(recognizer, microphone):
    with microphone as source:
        print("Please say the letter or word...")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)

    response = {"success": True, "error": None, "transcription": None}

    try:
        response["transcription"] = recognizer.recognize_google(audio)
    except sr.RequestError:
        response["success"] = False
        response["error"] = "API unavailable"
    except sr.UnknownValueError:
        response["error"] = "Unable to recognize speech"

    return response

def teach_phonics():
    recognizer = sr.Recognizer()
    microphone = sr.Microphone()

    while True:
        speech_recognition_result = recognize_speech_from_mic(recognizer, microphone)

        if speech_recognition_result["success"]:
            if speech_recognition_result["transcription"]:
                word = speech_recognition_result["transcription"].lower()
                print(f"\nYou said: {word}")

                sounds = break_word_into_sounds(word)
                print("The word is made up of these sounds:")
                print(sounds)
                print("\nGreat job! You've practiced saying the word!\n")
                time.sleep(1)
            else:
                print("I didn't catch that. Please try again.")
        else:
            print("There was an error: {}".format(speech_recognition_result["error"]))

teach_phonics()
