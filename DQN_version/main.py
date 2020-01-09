import asyncio, q_learning, state, time
from pyppeteer import launch

async def main():
    browser = await launch({'headless':False})
    page = await browser.newPage()
    await page.goto('D:/Documents/CoderYJazz/cs181 project/CS181-BBTan-Project/BBTan-master 2/index.html')

    QL = q_learning.approximateQlearning()
    for episode in range(300):
        await page.click('#mainCanvas')


        #首先我们初始化一个newstate
        observationini =  await page.evaluate('''() => {
                return {
                    tileMap: game.tileMap,startX: game.ballsLeftPosX, gameLevel: game.level, state: game.gameStatus, shootState: game.shootStatus
                }
            }''')
        newState = state.state(observationini['tileMap'], observationini['gameLevel'], observationini['startX'])
        status = observationini['state']
        shootStatus = observationini['shootState']
        i = 0
        while True:
            currentState = newState
            action = QL.getAction(currentState)
            print(action)
            
            while status != 'inGame' or shootStatus:
                time.sleep(1)
                checkState = await page.evaluate('''() => {
                    return {
                        gameStatus: game.gameStatus, shootState: game.shootStatus
                    }
                }''')
                status = checkState['gameStatus']
                shootStatus = checkState['shootState']
            await page.evaluate('game.shootingAngle = %f'% (action))
            check = await page.evaluate('''() => {
                return {
                    shootingAngle: game.shootingAngle
                }
            }''')
            print(check['shootingAngle'])
            
            # time.sleep(1)
            # await page.mouse.move(action[0],action[1])
            await page.mouse.down()
            await page.mouse.up()
            i += 1
            print(i)

            checkState = await page.evaluate('''() => {
                    return {
                        gameStatus: game.gameStatus, shootState: game.shootStatus
                    }
                }''')
            status = checkState['gameStatus']
            shootStatus = checkState['shootState']
            
            while status != 'inGame' or shootStatus:
                time.sleep(1)
                checkState = await page.evaluate('''() => {
                    return {
                        gameStatus: game.gameStatus, shootState: game.shootStatus
                    }
                }''')
                status = checkState['gameStatus']
                shootStatus = checkState['shootState']
                if status == 'gameOver':
                    break


            observation =  await page.evaluate('''() => {
                return {
                    tileMap: game.tileMap,startX: game.ballsLeftPosX, gameLevel: game.level, gameStatus: game.gameStatus
                }
            }''')
            if observation['gameStatus'] == 'gameOver':
                break
                
            else:
                newState.assignData(observation)
                QL.update(currentState, action, newState, i)
        QL.update(currentState, action, newState, -10)
        await page.mouse.move(500,100)
        await page.mouse.down()
        await page.mouse.up()

    await browser.close()
asyncio.get_event_loop().run_until_complete(main())


# if __name__ == "__main__":
#     QL = q_learning.approximateQlearning()





