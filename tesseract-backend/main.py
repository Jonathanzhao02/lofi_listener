import pytesseract
import math
import cv2
import sys
import os

if len(sys.argv) > 1:
    file_path = sys.argv[1]
else:
    raise Exception('Not enough arguments!')

try:
    CV_THRESH = int(os.environ["CV_THRESH"])
except:
    CV_THRESH = 190 # for 480p
    CV_THRESH = 240 # for 1080p

Y_CROP_RATIO = 50 / 1080
X_CROP_RATIO = 500 / 1920

image = cv2.imread(file_path)
[im_h,im_w,im_c] = image.shape
image = image[0:math.floor(Y_CROP_RATIO * im_h),:,:]

image = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)
image = cv2.threshold(image, CV_THRESH, 255, cv2.THRESH_BINARY)[1]
image = 255 - image

contours, hierarchy = cv2.findContours(255 - image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
used_contours = []

for cnt in contours:
    (x,y,w,h) = cv2.boundingRect(cnt)
    
    if x < X_CROP_RATIO * im_w:
        used_contours.append(cnt)

cv2.drawContours(image, used_contours,
                -1, 255, -1)

custom_oem_psm_config = r'--oem 0 --psm 7' # --tessdata-dir /Users/mac/Downloads/'
text = pytesseract.image_to_string(image, lang='eng', config=custom_oem_psm_config)
print(text)

"""image_src = cv2.imread("example.png")
gray = cv2.cvtColor(image_src, cv2.COLOR_BGR2GRAY)
ret, gray = cv2.threshold(gray, 230, 255, cv2.THRESH_BINARY_INV)

contours, hierarchy = cv2.findContours(gray, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
largest_area = sorted(contours, key=cv2.contourArea)[-1]
mask = np.zeros(image_src.shape, np.uint8)
cv2.drawContours(mask, [largest_area], 0, (255,255,255,255), -1)
dst = cv2.bitwise_and(image_src, mask)
mask = 255 - mask
roi = cv2.add(dst, mask)

roi_gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
ret, gray = cv2.threshold(roi_gray, 250,255,0)
contours, hierarchy = cv2.findContours(gray, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)

max_x = 0
max_y = 0
min_x = image_src.shape[1]
min_y = image_src.shape[0]

for c in contours:
    if 150 < cv2.contourArea(c) < 100000:
        x, y, w, h = cv2.boundingRect(c)
        min_x = min(x, min_x)
        min_y = min(y, min_y)
        max_x = max(x+w, max_x)
        max_y = max(y+h, max_y)

cv2.imwrite("processed.png", gray)"""
