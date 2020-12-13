import pytesseract
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
    CV_THRESH = 240

image = cv2.imread(file_path)
image = image[0:50,:,:]

gray = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)
thresh = cv2.threshold(gray, CV_THRESH, 255, cv2.THRESH_BINARY)[1]
thresh = 255 - thresh

# edged = cv2.Canny(thresh, 255, 0)
# contours, hierarchy = cv2.findContours(edged.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

# for cnt in contours:
#     if cv2.contourArea(cnt) > 1000 or cv2.contourArea(cnt) < 1:
#         (x,y,w,h) = cv2.boundingRect(cnt)
#         cv2.rectangle(image,(x,y),(x+w,y+h),(0,255,0),1)

# cv2.imwrite("contours.png", image)
# cv2.imwrite("processed.png", thresh)

custom_oem_psm_config = r'--oem 0 --psm 7' # --tessdata-dir /Users/mac/Downloads'
text = pytesseract.image_to_string(thresh, lang='eng', config=custom_oem_psm_config)
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
