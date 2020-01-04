import asyncio, q_learning, state
from pyppeteer import launch

async def main():
    browser = await launch()
    page = await browser.newPage()
    await page.goto('D:/Documents/CoderYJazz/cs181 project/CS181-BBTan-Project/BBTan-master 2/index.html')
    # await page.screenshot({'path': 'example.png'})
    QL = q_learning.approximateQlearning()
    for episode in range(300):
        
        #This observation is to initiate, maybe there is a better way to code QAQ
        #Note that this obseration is not the first one, but the one after the game begins!!!
        observation =  await page.evaluate('''() => {
                return {
                    tileMap: game.tileMap,startX: game.ballsLeftPosX, gameLevel: game.level
                }
            }''')
        print(observation['tileMap'], observation['startX'])
        #initiate a state
        newState = state.state(observation['tileMap'], observation['gameLevel'], observation['startX'])
        #newState.assignData(observation)

        featureDict = state.feature() #initiate feature dictionary
        
        while True:
            currentState = newState
            action = QL.getAction(currentState)

            observation =  await page.evaluate('''() => {
                return {
                    tileMap: game.tileMap,startX: game.ballsLeftPosX, gameLevel: game.level, gameStatus: game.gameStatus
                }
            }''')
            if observation['gameStatus'] == 'gameOver':
                break
            else:
                newState.assignData(observation)

                QL.update(currentState, action, newState, 1)
    # data = await page.evaluate('''() => {
    #     return {
    #         tileMap: game.tileMap,startX: game.ballsLeftPosX
    #     }
    # }''')

    
    # >>> {'width': 800, 'height': 600, 'deviceScaleFactor': 1}
    await browser.close()

asyncio.get_event_loop().run_until_complete(main())


# async def runQLearning(page):
    



# if __name__ == "__main__":
#     QL = q_learning.approximateQlearning()





