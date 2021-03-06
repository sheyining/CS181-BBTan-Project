import numpy
class state:
    def __init__(self, tileMatrix, level, xAxis):
        self.tileMatrix = tileMatrix
        self.level = level
        self.xAxis = xAxis

    def assignData(self, observation):
        self.tileMatrix = observation['tileMap']
        self.xAxis = observation['startX']
        self.level = observation['gameLevel']


class weight(dict):
    def __init__(self):
        dict.__init__(self,{'angleDiff1':1,'angleDiff2':1, 'angleDiff3':4, 'lowShooting':3})
    
    def nomalize(self):
        sumOfValues = sum([v for v in self.values()])
        for i in self.keys():
            self[i] /= sumOfValues

    
        # for feature in self:
        #     self[feature] = 1
