import asyncio, q_learning, state
from pyppeteer import launch

async def main():
    browser = await launch({'headless':False})
    page = await browser.newPage()
    await page.goto('D:/Documents/CoderYJazz/cs181 project/CS181-BBTan-Project/BBTan/index.html')

    QL = q_learning.approximateQlearning()
    for episode in range(300):
        await page.evaluate("game.gameStatus = 'inGame'")
        observation =  await page.evaluate('''() => {
                return {
                    tileMap: game.tileMap,startX: game.ballsLeftPosX, gameLevel: game.level
                }
            }''')
        newState = state.state(observation['tileMap'], observation['gameLevel'], observation['startX'])
        
        while True:
            currentState = newState
            action = QL.getAction(currentState)
            #await page.evaluate("SHOOTINGANGLE = ", action)
            await page.evaluate('shootingAngle = %d'% (action))
            #await page.click('#mainCanvas')
            await page.click('#mainCanvas')
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

    await browser.close()
asyncio.get_event_loop().run_until_complete(main())


# if __name__ == "__main__":
#     QL = q_learning.approximateQlearning()





