import util, pandas, math

side = 20

def transferMapPosToFigurePos(m, n):
    """把map的位置转为像素点的坐标  side指每一个小框框的边长，
    可能还需要加margin长度以及各种长度，最后应该得出的是在canvas里的相对位置
    （因为我们的startx是cancas里的相对位置?如果能转化成绝对位置也行"""
    a = (m+0.5)*side
    b = (n+0.5)*side
    return a, b

def angleCalculator(x1, y1, manX, manY):
    """计算的是球球或者框框与出发点的夹角，∠是朝右的"""
    return math.atan((y1-manY)/(x1-manX)) 


def getFeatures(state, action):
    feature = util.Counter()
    tileMap = state.tileMatrix
    level = state.level
    startPosX = state.xAxis
    startPosY = 0
    shootingAngle = action
    newMap = tileMap * level

    #转化成pandas text，比较容易得出最大值……
    miao = pandas.DataFrame(newMap)

    #feature1：计算权重最高的小框框所在的位置，角度差值
    maxValueAtMapX, maxValueAtMapY = miao.stack().idxmax()
    maxValueAtFigureX, maxValueAtFigureY = transferMapPosToFigurePos(maxValueAtMapX, maxValueAtMapY)
    feature['angleDiff1'] = 1/math.fabs(shootingAngle - angleCalculator(maxValueAtFigureX, maxValueAtFigureY, startPosX, startPosY))

    #feature2：计算最接近底层的   所在的位置，sumof角度差值
    angleDiff2 = 0.001#????
    lowestPosList = []
    lowestRow = -1
    for i in range(8, -1, -1):
        if tileMap[i] != [0,0,0,0,0,0,0]:
            lowestRow = i
            break
    for i in range(7):
        if tileMap[lowestRow][i] != 0:
            lowestPosList += [(lowestRow, i)]
    for i in lowestPosList: 
        m, n = i[0], i[1]
        x, y = transferMapPosToFigurePos(m, n)
        angleDiff2 += math.fabs(shootingAngle - angleCalculator(x, y, startPosX, startPosY))
    feature['angleDiff2'] = 10/angleDiff2
    
    #feature3 紧迫
    angleDiff3 = 0
    if tileMap[7] != [0,0,0,0,0,0,0]:
        for i in range(7):
            if tileMap[lowestRow][i] == 1:
                x, y = transferMapPosToFigurePos(7, i)
                angleDiff3 += math.fabs(shootingAngle - angleCalculator(x, y, startPosX, startPosY))
                feature['angleDiff3'] = 10/angleDiff3
    else:
        feature['angleDiff3'] = 0

        





    return feature
    

