import numpy, pandas, random, util, state

class QLearning:
    def __init__(self, learningRate = 0.01, discount = 0.9, explorationRate = 0.9, numTraining=100):
        self.actions = [1.0,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2.0,2.1,2.2,2.3,2.4,2.5,2.6,2.7,2.8] #a list???
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
        QLearning.__init__(self)
        self.weights = state.weight()
        self.features = state.feature()

    def getQValue(self, state, action):
        qValue = 0
        self.features.determineFeatureValue(state)
        print(self.weights)
        for i in self.features:
            qValue += self.features[i] * self.weights[i]
        return qValue

    #return action with highest Q-Value
    def computeActionFromQValues(self, state):
        maxValue = float('-Inf')
        bestAction = None
        for action in self.actions:
            value = self.getQValue(state, action)
            if value > maxValue:
                maxValue = value
                bestAction = action
        return bestAction

    def getAction(self, state):
        prob = self.epsilon
        if util.flipCoin(prob):
            action = random.choice(self.actions)
        else:
            action = self.computeActionFromQValues(state)
        return action    

    def update(self, state, action, nextState, reward):
        difference = reward + self.gamma * self.computeValueFromQValues(nextState) - self.getQValue(state, action)
        for feature in self.features:
            self.weights[feature] += self.alpha * difference * self.features[feature]

    def computeValueFromQValues(self, state):
        maxValue = float('-Inf')
        for action in self.actions:
            maxValue = max(maxValue, self.getQValue(state, action))
        return maxValue