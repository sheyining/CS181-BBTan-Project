import asyncio, q_learning, state, time
from pyppeteer import launch

async def main():
    browser = await launch({'headless':False})
    page = await browser.newPage()
    await page.goto('D:/Documents/CoderYJazz/cs181 project/CS181-BBTan-Project/BBTan-master 2/index.html')

    QL = q_learning.approximateQlearning()
    for episode in range(300):
        await page.click('#mainCanvas')
        observationini =  await page.evaluate('''() => {
                return {
                    tileMap: game.tileMap,startX: game.ballsLeftPosX, gameLevel: game.level, state: game.gameStatus
                }
            }''')
        newState = state.state(observationini['tileMap'], observationini['gameLevel'], observationini['startX'])
        status = observationini['state']
        #print(status)
        i = 0
        while True:
            currentState = newState
            action = QL.getAction(currentState)
            
            while status != 'nextLevel':
                time.sleep(2)
                checkState = await page.evaluate('''() => {
                    return {
                        gameStatus: game.gameStatus
                    }
                }''')
                status = checkState['gameStatus']
            #await page.evaluate('shootingAngle = %d'% (action))
            
            time.sleep(1)
            # await page.mouse.move(action[0],action[1])
            # await page.mouse.down()
            # await page.mouse.up()

            await page.mouse.click(1,1)
            i += 1
            print(i)
            time.sleep(1)
         


            checkState = await page.evaluate('''() => {
                    return {
                        gameStatus: game.gameStatus
                    }
                }''')
            status = checkState['gameStatus']
            while status == 'inGame':
                time.sleep(1)
                checkState = await page.evaluate('''() => {
                    return {
                        gameStatus: game.gameStatus
                    }
                }''')
                status = checkState['gameStatus']

            observation =  await page.evaluate('''() => {
                return {
                    tileMap: game.tileMap,startX: game.ballsLeftPosX, gameLevel: game.level, gameStatus: game.gameStatus
                }
            }''')
            if observation['gameStatus'] == 'gameOver':
                #break
                await page.mouse.down()
                await page.mouse.up()
            else:
                newState.assignData(observation)
                QL.update(currentState, action, newState, 1)

    await browser.close()
asyncio.get_event_loop().run_until_complete(main())


# if __name__ == "__main__":
#     QL = q_learning.approximateQlearning()





