import random

def flipCoin( p ):
    r = random.random()
    return r < p

class Counter(dict):
    def __getitem__(self, idx):
        self.setdefault(idx, 0)
        return dict.__getitem__(self, idx)