import json

array = [0, 1, 2, 3, 4, 5, 6, 0, 10, 11, 12, 13, 14, 15]
slopes = []

for i in range(len(array)):
    for j in range(i + 1, len(array)):
        a = (array[j] - array[i]) / (j - i)
        b = array[i] - a * i
        cur = next((item for item in slopes if item['a'] == a and item['b'] == b), None)
        if cur:
            cur['flag'] += 1
        else:
            slopes.append({'a': a, 'b': b, 'flag': 1, 'points': []})

slopes.sort(key=lambda item: item['flag'], reverse=True)
slopes = [item for item in slopes if item['flag'] > 5]

for line in slopes:
    a = line['a']
    b = line['b']
    for i in range(len(array)):
        if array[i] == a * i + b:
            line['points'].append({'x': i, 'y': array[i]})
    line['length'] = len(line['points'])

print(slopes)
print(json.dumps(slopes, indent=2))