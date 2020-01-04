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

class weight(dict):
    def __init__(self):
        self = {
        '00':1, '01':1, '02':1, '03':1, '04':1, '05':1, '06':1,
        '10':1, '11':1, '12':1, '13':1, '14':1, '15':1, '16':1,
        '20':1, '21':1, '22':1, '23':1, '24':1, '25':1, '26':1,
        '30':1, '31':1, '32':1, '33':1, '34':1, '35':1, '36':1,
        '40':1, '41':1, '42':1, '43':1, '44':1, '45':1, '46':1,
        '50':1, '51':1, '52':1, '53':1, '54':1, '55':1, '56':1,
        '60':1, '61':1, '62':1, '63':1, '64':1, '65':1, '66':1,
        '70':1, '71':1, '72':1, '73':1, '74':1, '75':1, '76':1,
        '80':1, '81':1, '82':1, '83':1, '84':1, '85':1, '86':1,
        'startX':1}
        # for feature in self:
        #     self[feature] = 1
