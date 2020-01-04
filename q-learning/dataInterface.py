import asyncio, q_learning
from pyppeteer import launch

async def main():
    browser = await launch()
    page = await browser.newPage()
    await page.goto('D:/Documents/CoderYJazz/cs181 project/CS181-BBTan-Project/BBTan-master 2/index.html')
    # await page.screenshot({'path': 'example.png'})

    data = await page.evaluate('''() => {
        return {
            tileMap: game.tileMap,startX: game.ballsLeftPosX
        }
    }''')

    print(data['tileMap'])
    # >>> {'width': 800, 'height': 600, 'deviceScaleFactor': 1}
    await browser.close()

asyncio.get_event_loop().run_until_complete(main())


def runQLearning():
    step = 0
    for episode in range(300):
        
        #This observation is to initiate, maybe there is a better way to code QAQ
        #Note that this obseration is not the first one, but the one after the game begins!!!
        observation =  await page.evaluate('''() => {
                return {
                    tileMap: game.tileMap,startX: game.ballsLeftPosX, gameLevel: game.level
                }
            }''')
        
        #initiate a state
        newState = state.state
        newState.assignData(observation)

        featureDict = state.feature() #initiate feature dictionary
        
        while True:
            currentState = newState
            
            observation =  await page.evaluate('''() => {
                return {
                    tileMap: game.tileMap,startX: game.ballsLeftPosX, gameLevel: game.level
                }
            }''')

            newState.assignData(observation)







