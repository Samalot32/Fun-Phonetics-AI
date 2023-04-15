from PIL import Image, ImageTk
import speech_recognition as sr
import tkinter as tk
from tkinter import ttk
import random
import time

def recognize_speech_from_mic(recognizer, microphone):
    with microphone as source:
        print("Please say the letter...")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)

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

def show_next_letter():
    global current_letter
    current_letter = random.choice(letters)
    letter_image = Image.open(f"./images/{current_letter}.png")
    letter_image = letter_image.resize((200, 200), Image.ANTIALIAS)
    photo = ImageTk.PhotoImage(letter_image)
    letter_label.config(image=photo)
    letter_label.image = photo

def prompt_child():
    global total_attempts, correct_attempts
    result = recognize_speech_from_mic(recognizer, microphone)

    if result["success"]:
        if result["transcription"]:
            spoken_letter = result["transcription"].lower()
            total_attempts += 1
            if spoken_letter == current_letter.lower():
                correct_attempts += 1
                print("Nice job!")
                print("Score", correct_attempts)
                show_results()
                show_next_letter()
            else:
                print("Incorrect, please try again.")
        else:
            print("I didn't catch that. Please try again.")
    else:
        print("There was an error: {}".format(result["error"]))

# def displayMessage(message):
#     result_window = tk.Toplevel(root)
#     result_window.title("Results")
#     result_label = ttk.Label(result_window, text=f"Correct: {correct_attempts}\nTotal: {total_attempts}", font=("Arial", 14))
#     result_label.pack(padx=20, pady=20)

def show_results():
    result_window = tk.Toplevel(root)
    result_window.title("Results")
    result_label = ttk.Label(result_window, text=f"Correct: {correct_attempts}\nTotal: {total_attempts}", font=("Arial", 14))
    result_label.pack(padx=200, pady=200)

# letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
letters = ['Astronaut', 'Boat']
current_letter = None
total_attempts = 0
correct_attempts = 0

recognizer = sr.Recognizer()
microphone = sr.Microphone()

root = tk.Tk()
root.title("Fun Phonetics")

letter_label = ttk.Label(root)
letter_label.pack(pady=20)

prompt_button = ttk.Button(root, text="Record", command=prompt_child)
prompt_button.pack(pady=10)

next_button = ttk.Button(root, text="Next", command=show_next_letter)
next_button.pack(pady=10)

result_button = ttk.Button(root, text="Show Results", command=show_results)
result_button.pack(pady=10)

show_next_letter()
root.mainloop()
