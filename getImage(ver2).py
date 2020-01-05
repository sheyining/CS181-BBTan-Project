import pyautogui
import cv2
import numpy as np

np.set_printoptions(threshold=np.inf)

img = pyautogui.screenshot(region=[1050,270,800,1300]) # x轴位置（截图区域左上角）,y轴位置（截图区域左上角）,width（截图区域宽度）,h（截图区域高度）
img.save('screenshot.png')

#png图片的压缩
img = cv2.imread('./screenshot.png',100)
#对于png文件的压缩，第三个参数是压缩质量 1M 100K 10K 图片质量的范围是0-100 有损压缩
cv2.imwrite('./screenshot.png',img,[cv2.IMWRITE_JPEG_QUALITY,9])
#png图片的额压缩压缩质量参数数值越小，压缩比越小，压缩质量范围0-9，png有透明度属性

img = cv2.cvtColor(np.asarray(img),cv2.COLOR_RGB2BGR)
print(img)
# print(len(img))

