import numpy, pandas, random, util

class QLearning:
    def __init__(self, actions, learningRate = 0.01, discount = 0.9, explorationRate = 0.9, numTraining=100):
        self.actions = actions #a list
        self.alpha = learningRate
        self.gamma = discount
        self.epsilon = explorationRate
        self.numTraining = numTraining
        self.qLearningTable = pandas.DataFrame(columns = self.actions, dtype = numpy.float64)
        self.values = util.Counter()
        

    
    def getQValue(self, state, action):
        if self.values[(state, action)] == None:
            return 0.0
        else:
            return self.values[(state, action)]
    
    def computeValueFromQValues(self, state):
        maxValue = float('-Inf')
        for action in self.actions:
            maxValue = max(maxValue, self.getQValue(state, action))
        return maxValue

    def computeActionFromQValues(self, state):
        maxValue = float('-Inf')
        bestAction = None
        for action in self.actions:
            if self.getQValue(state, action) > maxValue:
                maxValue = self.getQValue(state, action)
                bestAction = action
        return bestAction
        

    def getAction(self, state):
        prob = self.epsilon
        if util.flipCoin(prob):
            action = random.choice(self.actions)
        else:
            action = self.computeActionFromQValues(state)
        return action    

    
class approximateQlearning(QLearning):
    def __init__(self):
        self.weights = util.Counter()
        self.features = util.Counter()

    def getQValue(self, state, action):
        qValue = 0
        for feature in self.features:
          qValue += self.features[feature] * self.weights[feature]
        return qValue

    def update(self, state, action, nextState, reward):
        difference = reward + self.gamma * self.computeValueFromQValues(nextState) - self.getQValue(state, action)
        for feature in self.features:
          self.weights[feature] += self.alpha * difference * self.features[feature]