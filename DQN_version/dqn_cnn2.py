import os
import numpy as np
import sys
import tensorflow as tf
from tensorflow.contrib.learn.python.learn.datasets.mnist import read_data_sets
import requests
import time

def compute_accuracy(v_xs, v_ys):
    global predict
    y_pre = sess.run(predict, feed_dict={x_train: v_xs, keep_drop: 1})
    correct_prediction = tf.equal(tf.argmax(y_pre,1), tf.argmax(v_ys,1))
    accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
    result = sess.run(accuracy, feed_dict={x_train: v_xs, y_train: v_ys, keep_drop: 1})
    return result

def weight_avriable(shape):
    initial = tf.random.truncated_normal(shape,stddev=0.1)
    return tf.Variable(initial)

def bias_variable(shape):
    initial = tf.constant(0.1,shape=shape)
    return tf.Variable(initial)

def conv2d(x,W):
    #strides [1,x_move,y_move,1], strides[0] and strides[3] must be 1
    return tf.nn.conv2d(x, W, strides=[1,1,1,1], padding='SAME')

def max_pool_2x2(x):
    return tf.nn.max_pool2d(x, ksize=[1,2,2,1], strides=[1,2,2,1], padding='SAME')

x_train = tf.compat.v1.placeholder(tf.float32, [None, 784]) #image size 28x28
y_train = tf.compat.v1.placeholder(tf.float32, [None, 10]) #number 0-9
keep_drop=tf.compat.v1.placeholder(tf.float32)
x_image = tf.reshape(x_train, [-1, 28, 28, 1])#-1*28*28*1


#conv1 layer
W_conv1 = weight_avriable([5,5,1,32]) #patch 5x5, in size 1, out size 32
b_conv1 = bias_variable([32])
h_conv1 = tf.nn.relu(conv2d(x_image, W_conv1) + b_conv1) #output 28x28x32
h_pool1 = max_pool_2x2(h_conv1) #output 14x14x32

#conv2 layer
W_conv2 = weight_avriable([5,5,32,64]) #patch 5x5, in size 32, out size 64
b_conv2 = bias_variable([64])
h_conv2 = tf.nn.relu(conv2d(h_pool1, W_conv2) + b_conv2) #output 14x14x64
h_pool2 = max_pool_2x2(h_conv2) #output 7x7x64

#func1 layer
W_fc1 = weight_avriable([7*7*64,1024])
b_fc1 = bias_variable([1024])
h_pool2_flat = tf.reshape(h_pool2,[-1,7*7*64])
h_fc1 = tf.nn.relu(tf.matmul(h_pool2_flat, W_fc1) + b_fc1)
# h_fc1_drop = tf.nn.dropout(h_fc1,rate=1-keep_drop)
h_fc1_drop=tf.nn.dropout(h_fc1,keep_prob)

#func2 layer
W_fc2 = weight_avriable([1024,10])
b_fc2 = bias_variable([10])
predict= tf.nn.softmax(tf.matmul(h_fc1_drop, W_fc2) + b_fc2)

#image data
mnist= read_data_sets('MNIST_data',one_hot=True)

#loss, cross_entropy
loss = tf.reduce_mean(-tf.reduce_sum(y_train * tf.math.log(predict), reduction_indices=[1]))

#train step
train_step = tf.compat.v1.train.AdamOptimizer(1e-4).minimize(loss)

#checkpoint path
path = 'G:/Tensorflow/CNN_TF/checkpoint/mnist_train.ckpt'
saver = tf.compat.v1.train.Saver()

with tf.compat.v1.Session() as sess:
    sess.run(tf.compat.v1.global_variables_initializer())

if os.path.exists(path + '.meta'):
    print("\nload checkpoint ...\n")
    saver.restore(sess,path)

stime = time.time()

for i in range(100001):
    batch_x, batch_y = mnist.train.next_batch(100)
    sess.run(train_step, feed_dict={x_train: batch_x, y_train: batch_y, keep_drop: 0.5})
    if i % 1000 == 0:
        acc = compute_accuracy(mnist.test.images[:1000], mnist.test.labels[:1000])
        print('#' + "{:0>5d}".format(i),',',acc, ', used time', int((time.time() - stime)*1000)/1000)

saver.save(sess,path)