import sys
import cv2

import gym
import os
import tensorflow as tf
import numpy as np
import random
from collections import deque
import pickle
import math


import asyncio,  time
from pyppeteer import launch

CNN_INPUT_WIDTH = 180
CNN_INPUT_HEIGHT = 280
CNN_INPUT_DEPTH = 1
SERIES_LENGTH = 4

REWARD_COFF = 3.0

INITIAL_EPSILON = 1.0
FINAL_EPSILON = 0.0001
REPLAY_SIZE = 50000
BATCH_SIZE = 32
GAMMA = 1
OBSERVE_TIME = 500
ENV_NAME = 'Breakout-v0'
EPISODE = 3
STEP = 1500
TEST = 10
REPLACE_TARGET_ITER = 300
ACTION_NUMBER = 15

# class ImageProcess():
#     def ColorMat2Binary(self, page):
#         # browser = await launch()
#         # page = await browser.newPage()
#         # await page.goto('C:/Users/SAM SHE/Desktop/My Work/cs181/Final Project/CS181-BBTan-Project/BBTan-master 2(revised)/BBTan-master 2/index.html')
#         # await page.click('#mainCanvas')
#         time.sleep(2)
#         await page.screenshot({'path': 'example.png'})
#         img = cv2.imread('./example.png')
#         cropped = img[0:600, 220:580]
#         # print(cropped.shape)

#         checkState = await page.evaluate('''() => {
#                 return {
#                     tileMap: game.tileMap, levelMap: game.levelMap
#                 }
#             }''')
#         tileMap = checkState['tileMap']
#         levelMap = checkState['levelMap']

#         for i in range(len(tileMap[0])):
#             for j in range(len(tileMap)):
#                 x = (50 * i) + 3 + 5
#                 y = (50 * j) + 3 + 60 - 12
#                 # print(x,y)
#                 if (tileMap[j][i] == 1):
#                     cropped[y-2 : y+46 , x-2 : x+46] = np.array(  [ [[levelMap[j][i]+20]*3] *48 ] *48 )
#         cropped = cropped[48 : 600-92, :]   
#         # print(cropped.shape) 
#         cropped = cv2.resize(cropped, (180, 240))
#         cropped = cv2.cvtColor(cropped,cv2.COLOR_BGR2GRAY) 
#         return cropped
#         # cv2.imwrite('cropped.png' ,croppped)


class DQN():
    def __init__(self):
        # self.imageProcess = ImageProcess()
        self.epsilon = INITIAL_EPSILON
        self.replay_buffer = deque()
        self.recent_history_queue = deque()
        self.action_dim = ACTION_NUMBER
        self.state_dim = CNN_INPUT_HEIGHT * CNN_INPUT_WIDTH
        self.time_step = 0
        self.keep_prob = 0.5

        self.session = tf.InteractiveSession()
        self.create_network()
        self.path = "/breakout_sample/save_next.ckpt"       
        self.saver = tf.train.Saver()

        self.observe_time = 0

        self.memory_path = os.getcwd() + "/breakout_sample/memory_replay.pk"
        if os.path.exists(self.memory_path):
            print("/nload replay buffer .../n")
            self.replay_buffer = pickle.load(open(self.memory_path, 'rb'))

        self.merged = tf.summary.merge_all()
        self.summary_writer = tf.summary.FileWriter('/path/to/logs', self.session.graph)

        t_params = tf.get_collection(tf.GraphKeys.GLOBAL_VARIABLES, scope='target_net')
        e_params = tf.get_collection(tf.GraphKeys.GLOBAL_VARIABLES, scope='eval_net')

        with tf.variable_scope('hard_replacement'+'.pickle'):
            self.target_replace_op = [tf.assign(t, e) for t, e in zip(t_params, e_params)]


        self.session.run(tf.global_variables_initializer())
        if os.path.exists(self.path + '.meta'):
            print("/nload checkpoint .../n")
            self.saver.restore(self.session,self.path)
            # print(self.session.run())
        

    def create_network(self):

        INPUT_DEPTH = SERIES_LENGTH

        self.input_layer = tf.placeholder(tf.float32, [None, CNN_INPUT_WIDTH, CNN_INPUT_HEIGHT, INPUT_DEPTH],
                                          name='status-input')
        self.action_input = tf.placeholder(tf.float32, [None, self.action_dim])
        self.y_input = tf.placeholder(tf.float32, [None])

        with tf.variable_scope('eval_net'):
            W1 = self.get_weights([8, 8, 4, 32]) #patch 8x8, in size 4, out size 32
            b1 = self.get_bias([32])
            W2 = self.get_weights([4, 4, 32, 64])
            b2 = self.get_bias([64])
            W3 = self.get_weights([3, 3, 64, 64])
            b3 = self.get_bias([64])
            W_fc1 = self.get_weights([70*45*64, 1024])
            b_fc1 = self.get_bias([1024])
            W_fc2 = self.get_weights([1024, self.action_dim])
            b_fc2 = self.get_bias([self.action_dim])

            h_conv1 = tf.nn.relu(tf.nn.conv2d(self.input_layer, W1, strides=[1, 4, 4, 1], padding='SAME') + b1) #output 280x180x32
            conv1 = tf.nn.max_pool(h_conv1, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME') #output 140x90x32

            h_conv2 = tf.nn.relu(tf.nn.conv2d(conv1, W2, strides=[1, 2, 2, 1], padding='SAME') + b2) #output 140x90x64
            conv2 = tf.nn.max_pool(h_conv2, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME') #output 70x45x64

            h_conv3 = tf.nn.relu(tf.nn.conv2d(h_conv2, W3, strides=[1, 1, 1, 1], padding='SAME') + b3) #output 70x45x64
            # h_conv2_flat = tf.reshape( h_conv2, [ -1, 11 * 11 * 32 ] )
            h_pool2_flat = tf.reshape(h_conv3, [-1, 70*45*64])

            h_fc1 = tf.nn.relu(tf.matmul(h_pool2_flat, W_fc1) + b_fc1)
            h_fc1_drop = tf.nn.dropout(h_fc1,self.keep_prob)

            self.Q_value = tf.nn.softmax(tf.matmul(h_fc1_drop, W_fc2) + b_fc2)    #predict

        with tf.variable_scope('target_net'):
            t_W1 = self.get_weights([8, 8, 4, 32])
            t_b1 = self.get_bias([32])
            t_W2 = self.get_weights([4, 4, 32, 64])
            t_b2 = self.get_bias([64])
            t_W3 = self.get_weights([3, 3, 64, 64])
            t_b3 = self.get_bias([64])
            t_W_fc1 = self.get_weights([70*45*64, 1024])
            t_b_fc1 = self.get_bias([1024])
            t_W_fc2 = self.get_weights([1024, self.action_dim])
            t_b_fc2 = self.get_bias([self.action_dim])

            t_h_conv1 = tf.nn.relu(tf.nn.conv2d(self.input_layer, t_W1, strides=[1, 4, 4, 1], padding='SAME') + t_b1)
            t_conv1 = tf.nn.max_pool(t_h_conv1, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')

            t_h_conv2 = tf.nn.relu(tf.nn.conv2d(t_conv1, t_W2, strides=[1, 2, 2, 1], padding='SAME') + t_b2)
            # t_conv2 = tf.nn.max_pool( t_h_conv2, ksize = [ 1, 2, 2, 1 ], strides= [ 1, 2, 2, 1 ], padding= 'SAME' )
            t_h_conv3 = tf.nn.relu(tf.nn.conv2d(t_h_conv2, t_W3, strides=[1, 1, 1, 1], padding='SAME') + t_b3)
            t_h_pool2_flat = tf.reshape(t_h_conv3, [-1, 70*45*64])
            t_h_fc1 = tf.nn.relu(tf.matmul(t_h_pool2_flat, t_W_fc1) + t_b_fc1)
            # t_h_fc1_drop = tf.nn.dropout(t_h_fc1,self.keep_prob)

            self.t_Q_value = tf.nn.softmax(tf.matmul(t_h_fc1, t_W_fc2) + t_b_fc2)

        Q_action = tf.reduce_sum(tf.multiply(self.Q_value, self.action_input), reduction_indices=1)
        self.cost = tf.reduce_mean(tf.square(self.y_input - Q_action))
        self.optimizer = tf.train.AdamOptimizer(1e-6).minimize(self.cost)


    def train_network(self):
        if self.time_step % REPLACE_TARGET_ITER == 0:
            self.session.run(self.target_replace_op)
            print('/ntarget_params_replaced/n')

        self.time_step += 1

        minibatch = random.sample(self.replay_buffer, BATCH_SIZE)
        state_batch = [data[0] for data in minibatch]
        action_batch = [data[1] for data in minibatch]
        reward_batch = [data[2] for data in minibatch]
        next_state_batch = [data[3] for data in minibatch]
        done_batch = [data[4] for data in minibatch]

        y_batch = []
        t_Q_value_batch = self.t_Q_value.eval(feed_dict={self.input_layer: next_state_batch})


        for i in range(BATCH_SIZE):

            if done_batch[i]:
                y_batch.append(reward_batch[i])
            else:
                # y_batch.append(reward_batch[i] + GAMMA * np.max(Q_value_batch[i]))
                y_batch.append(reward_batch[i] + GAMMA * np.max(t_Q_value_batch[i]))

        self.optimizer.run(feed_dict={

            self.input_layer: state_batch,
            self.action_input: action_batch,
            self.y_input: y_batch
            # self.keep_prob: 0.5

        })




    def percieve(self, state_shadow, action_index, reward, state_shadow_next, done, episode):

        action = np.zeros( self.action_dim )
        action[ action_index ] = 1

        self.replay_buffer.append([state_shadow, action, reward, state_shadow_next, done])

        self.observe_time += 1
        if self.observe_time % 1000 and self.observe_time <= OBSERVE_TIME == 0:
            print( self.observe_time)

        if len(self.replay_buffer) > REPLAY_SIZE:
            self.replay_buffer.popleft()

        if len(self.replay_buffer) > BATCH_SIZE and self.observe_time > OBSERVE_TIME:
            self.train_network()

    def get_greedy_action(self, state_shadow):

        rst = self.Q_value.eval(feed_dict={self.input_layer: [state_shadow]})[0]
        # print rst
        print (np.max( rst ))
        return np.argmax(rst)

    def get_action(self, state_shadow):
        if self.epsilon >= FINAL_EPSILON and self.observe_time > OBSERVE_TIME:
            self.epsilon -= (INITIAL_EPSILON - FINAL_EPSILON) / 50000

        # action = np.zeros(self.action_dim)
        action_index = None
        if random.random() < self.epsilon:
            action_index = random.randint(0, self.action_dim - 1)
        else:
            action_index = self.get_greedy_action(state_shadow)

        return action_index


    def get_weights(self, shape):
        weight = tf.truncated_normal(shape, stddev=0.01)
        return tf.Variable(weight)

    def get_bias(self, shape):
        bias = tf.constant(0.01, shape=shape)
        return tf.Variable(bias)

    def save_net(self):
        # self.saver.save(self.session,self.path)
        print("Save network to path:", self.path)
    
    def save_memory(self):
        pickle.dump(self.replay_buffer, open(self.memory_path, 'wb'))
        print("Save memory to path:", self.memory_path)






async def main():
    async def ColorMat2Binary():
        # browser = await launch()
        # page = await browser.newPage()
        # await page.goto('C:/Users/SAM SHE/Desktop/My Work/cs181/Final Project/CS181-BBTan-Project/BBTan-master 2(revised)/BBTan-master 2/index.html')
        # await page.click('#mainCanvas')
        time.sleep(2)
        await page.screenshot({'path': 'example.png'})
        img = cv2.imread('./example.png')
        cropped = img[0:600, 220:580]
        # print(cropped.shape)

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
        cropped = cv2.cvtColor(cropped,cv2.COLOR_BGR2GRAY) 
        return cropped

    browser = await launch({'headless':False})
    page = await browser.newPage()
    await page.goto('C:/Users/SAM SHE/Desktop/My Work/cs181/Final Project/CS181-BBTan-Project/BBTan-master 2(revised)/BBTan-master 2/index.html')

    state_shadow = None
    next_state_shadow = None


    agent = DQN()
    total_reward_decade = 0

    actions = [0.26+i*(math.pi-0.52)/19 for i in range(20)]

    for episode in range(EPISODE):
        await page.click('#mainCanvas')

        # total_reward = 0
        state = ColorMat2Binary(page)  # now state is a binary image of 80 * 80
        state_shadow = np.stack((state, state, state, state), axis=2)

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
            action = agent.get_action(state_shadow)

            while status != 'inGame' or shootStatus:
                time.sleep(1)
                checkState = await page.evaluate('''() => {
                    return {
                        gameStatus: game.gameStatus, shootState: game.shootStatus
                    }
                }''')
                status = checkState['gameStatus']
                shootStatus = checkState['shootState']
            await page.evaluate('game.shootingAngle = %f'% (actions[action]))
            await page.mouse.down()
            await page.mouse.up()

            reward = i
            i += 1

            # next_state, reward, done, _ = env.step(action)
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
                    next_state = ColorMat2Binary( next_state )
                    next_state_shadow = np.append( next_state, state_shadow[ :,:,:3 ], axis= 2 )
                    agent.percieve(state_shadow, action, reward, next_state_shadow, status == 'gameOver', episode)
                    break
                
            next_state = ColorMat2Binary( next_state )
            next_state_shadow = np.append( next_state, state_shadow[ :,:,:3 ], axis= 2 )

            # total_reward += reward
            agent.percieve(state_shadow, action, reward, next_state_shadow, status == 'gameOver', episode)
            state_shadow = next_state_shadow

            if done:
                break
        
        print ('Episode:', episode, 'Total Point this Episode is:', total_reward)
        total_reward_decade += total_reward
        if episode % 10 == 0:
            print ('-------------')
            print ('Decade:', episode / 10, 'Total Reward in this Decade is:', total_reward_decade)
            print ('-------------')
            total_reward_decade = 0
        if(episode%1000==0):
            agent.save_net()
    agent.save_net()
    agent.save_memory()

    await browser.close()



asyncio.get_event_loop().run_until_complete(main())