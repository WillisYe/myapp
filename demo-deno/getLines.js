// deno run -A getLines.js
// 在一条直线上的点都满足 y = ax + b
var array = [0, 1, 2, 3, 4, 5, 6, 0, 10, 11, 12, 13, 14, 15]
var slopes = []

async function main() {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (i != j) {
        var a = (array[j] - array[i]) / (j - i)
        var b = array[i] - a * i
        var cur = slopes.find(item => item.a == a && item.b == b)
        if (cur) {
          cur.flag++
        } else {
          slopes.push({ a, b, flag: 1, points: [] })
        }
      }
    }
  }
  slopes = slopes.sort((cur, pre) => pre.flag - cur.flag)
  slopes = slopes.filter(item => item.flag > 5)
  for (const line of slopes) {
    var a = line.a
    var b = line.b
    for (let i = 0; i < array.length; i++) {
      if (array[i] == a * i + b) {
        line.points.push({ x: i, y: array[i] })
      }
    }
    line.length = line.points.length
  }

  console.log(JSON.stringify(slopes, null, 2))
}

main()