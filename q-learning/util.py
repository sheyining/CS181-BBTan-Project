import random, math

#define 5 actions
action1 = (math.pi/2)*0.5
action2 = (math.pi/2)*0.75
action3 = (math.pi/2)*1
action4 = (math.pi/2)*1.25
action5 = (math.pi/2)*1.5


def flipCoin( p ):
    r = random.random()
    return r < p

class Counter(dict):
    def __getitem__(self, idx):
        self.setdefault(idx, 0)
        return dict.__getitem__(self, idx)

