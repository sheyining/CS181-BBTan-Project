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


class feature(dict):
    def __init__(self):
        self = {
        '00':0, '01':0, '02':0, '03':0, '04':0, '05':0, '06':0,
        '10':0, '11':0, '12':0, '13':0, '14':0, '15':0, '16':0,
        '20':0, '21':0, '22':0, '23':0, '24':0, '25':0, '26':0,
        '30':0, '31':0, '32':0, '33':0, '34':0, '35':0, '36':0,
        '40':0, '41':0, '42':0, '43':0, '44':0, '45':0, '46':0,
        '50':0, '51':0, '52':0, '53':0, '54':0, '55':0, '56':0,
        '60':0, '61':0, '62':0, '63':0, '64':0, '65':0, '66':0,
        '70':0, '71':0, '72':0, '73':0, '74':0, '75':0, '76':0,
        '80':0, '81':0, '82':0, '83':0, '84':0, '85':0, '86':0,
        'startX':0}
    
    def determineFeatureValue(self, state):
        self['startX'] = state.xAxis
        print(state.xAxis)
        for i in range(len(state.tileMatrix)):
            for j in range(len(state.tileMatrix[0])):
                self['ij'] = state.tileMatrix[i][j] * state.level

class weight(feature):
    def __init__(self):
        feature.__init__(self)
        for feature in self:
            self[feature] = 1
