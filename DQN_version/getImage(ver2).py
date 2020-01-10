# import pyautogui
import asyncio
import cv2
import numpy as np
import time
from pyppeteer import launch

# np.set_printoptions(threshold=np.inf)

# img = pyautogui.screenshot(region=[1050,270,800,1300]) # x轴位置（截图区域左上角）,y轴位置（截图区域左上角）,width（截图区域宽度）,h（截图区域高度）
# img.save('screenshot.png')

# #png图片的压缩
# img = cv2.imread('./screenshot.png',100)
# #对于png文件的压缩，第三个参数是压缩质量 1M 100K 10K 图片质量的范围是0-100 有损压缩
# cv2.imwrite('./screenshot.png',img,[cv2.IMWRITE_JPEG_QUALITY,9])
# #png图片的额压缩压缩质量参数数值越小，压缩比越小，压缩质量范围0-9，png有透明度属性

# img = cv2.cvtColor(np.asarray(img),cv2.COLOR_RGB2BGR)
# print(img)
# # print(len(img))

async def main():
    browser = await launch()
    page = await browser.newPage()
    await page.goto('C:/Users/SAM SHE/Desktop/My Work/cs181/Final Project/CS181-BBTan-Project/BBTan-master 2(revised)/BBTan-master 2/index.html')
    await page.click('#mainCanvas')
    time.sleep(2)
    await page.screenshot({'path': 'example.png'})
    img = cv2.imread('./example.png')
    cropped = img[0:600, 220:580]
    print(cropped.shape)

    checkState = await page.evaluate('''() => {
            return {
                tileMap: game.tileMap, levelMap: game.levelMap
            }
        }''')
    tileMap = checkState['tileMap']
    levelMap = checkState['levelMap']

    for i in range(len(tileMap[0])):
        for j in range(len(tileMap)):
            x = (50 * i) + 3 + 5
            y = (50 * j) + 3 + 60 - 12
            # print(x,y)
            if (tileMap[j][i] == 1):
                cropped[y-2 : y+46 , x-2 : x+46] = np.array(  [ [[levelMap[j][i]+20]*3] *48 ] *48 )
    cropped = cropped[48 : 600-92, :]   
    # print(cropped.shape) 
    cropped = cv2.resize(cropped, (180, 240))
    # cropped = cv2.resize(cropped, [280, 180])
    

    cv2.imwrite('cropped.png' ,cropped)
    await browser.close()

asyncio.get_event_loop().run_until_complete(main())