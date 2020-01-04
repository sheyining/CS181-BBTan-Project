# Q-learning Part

In this part we aim to utilize approximate Q-learning to calculate Q-value of current state and action at each step instead of restoring them in a table which is both memory and running-time consumed, not to say that the number of all states in this game is infinite due to its characteristic of upgrade, which stopped us from associating states with its value straightly. 

Approximate Q-learning has plenty of advantages over basic Q-learning according to our lecture slides. It is based on a fundamental idea in machine learning which is generalizing across states. From experience, the artificial intelligence learns about some number of training states and will generalize that experience to new, similar situations in the future.

Of approximate Q-learning, the most important thing is to determine the features that may have vital influence on the calculation of Q-value. (Features are functions from states to real numbers that capture important propoties of the state.)

Some other parameters such as learning rate, exploration rate and discount are also significant in the learning process of our artificial intelligence because the algorithm can be written as:




The origin file of BBTan game we are using is based on web programming language. 