import pyautogui
import cv2
import numpy as np

np.set_printoptions(threshold=np.inf)

img = pyautogui.screenshot(region=[1050,270,800,1300]) # x轴位置（截图区域左上角）,y轴位置（截图区域左上角）,width（截图区域宽度）,h（截图区域高度）
img.save('screenshot.png')
img = cv2.cvtColor(np.asarray(img),cv2.COLOR_RGB2BGR)
print(img)