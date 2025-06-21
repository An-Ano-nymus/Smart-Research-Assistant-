import cv2
import pytesseract
from pdf2image import convert_from_path
import os

# Set path to tesseract executable (only for Windows)
if os.name == 'nt':
    pytesseract.pytesseract.tesseract_cmd = r"D:\Raghav\EVOLUTION\Image to text via tesseract\tesseract.exe"

def img_to_string(image_path):
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    text = pytesseract.image_to_string(gray, lang='eng')
    return text

def pdf_to_text(pdf_path):
    pages = convert_from_path(pdf_path, dpi=300)
    text_all = ""

    for i, page in enumerate(pages):
        temp_img_path = f"temp_page_{i}.png"
        page.save(temp_img_path, 'PNG')

        img = cv2.imread(temp_img_path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        text = pytesseract.image_to_string(gray, lang='eng')
        text_all += f"\n--- Page {i + 1} ---\n{text}"
        os.remove(temp_img_path)

    return text_all

def auto_text(file_path):
    if file_path.lower().endswith('.pdf'):
        return pdf_to_text(file_path)
    return img_to_string(file_path)
