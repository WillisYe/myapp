import os
import requests
import re
import time
import json
from lxml import etree
from urllib import request
from colorama import init, Fore, Back, Style

init()

header = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'}

# 20
list = [
    {"index": 0, "href": "/music/t_w_hits.htm", "tit": "2023歌曲排行榜"},
    {"index": 1, "href": "/music/t_hits.htm", "tit": "2022歌曲排行榜"},
    {"index": 2, "href": "/music/t_m_hits.htm", "tit": "歌曲Top500首"},
    {"index": 3, "href": "/music/t_new.htm", "tit": "2023最新歌曲"},
    {"index": 4, "href": "/music/t_allhits.htm", "tit": "一人一首成名曲"},
    {"index": 5, "href": "/music/bdhot.htm", "tit": "百度排行榜"},
    {"index": 6, "href": "/music/sshot.htm", "tit": "QQ排行榜"},
    {"index": 7, "href": "/music/kuwohot.htm", "tit": "酷我排行榜"},
    {"index": 8, "href": "/music/kugouhot.htm", "tit": "酷狗排行榜"},
    {"index": 9, "href": "/zhuanji/3.htm", "tit": "经典老歌"},
    {"index": 10, "href": "/zhuanji/55.htm", "tit": "网络歌曲"},
    {"index": 11, "href": "/zhuanji/7.htm", "tit": "伤感歌曲"},
    {"index": 12, "href": "/zhuanji/66.htm", "tit": "英文歌曲"},
    {"index": 13, "href": "/zhuanji/25.htm", "tit": "非主流歌曲"},
    {"index": 14, "href": "/zhuanji/13.htm", "tit": "DJ舞曲榜"},
    {"index": 15, "href": "/zhuanji/11.htm", "tit": "粤语歌曲"},
    {"index": 16, "href": "/zhuanji/taste8.htm", "tit": "欧美歌曲"},
    {"index": 17, "href": "/zhuanji/taste9.htm", "tit": "韩国歌曲"},
    {"index": 18, "href": "/zhuanji/73.htm", "tit": "电影歌曲"},
    {"index": 19, "href": "/zhuanji/75.htm", "tit": "KTV歌曲"}
]

songID = []  # 列表存放歌曲编号
songName = []  # 列表存放歌曲名字
songID1 = []  # 列表存放歌曲编号
# 构造url
for i in range(0, 1):
    cur = list[9]
    url = "http://www.9ku.com" + cur['href']
    print('榜单名称', cur['tit'])
    req = request.Request(url, headers=header)
    data_html = request.urlopen(req).read().decode()

    html = etree.HTML(data_html)

    pat1 = '//a[@class="songName "]/@href'
    pat2 = '//a[@class="songName "]/text()'

    idlist = html.xpath(pat1)
    titlelist = html.xpath(pat2)
    # 从网页中获取所有歌曲名字
    songID1.extend(idlist)  # 把多个列表合成一个列表
    songName.extend(titlelist)

    pat4 = '/play/(.*?).htm'
    for j in range(0, len(songID1)):
        idlist2 = re.findall(pat4, songID1[j])  # 从网页中获取所有歌曲ID
        songID.extend(idlist2)

# print(songName)
# print(songID)
# print(len(songName))
print('歌曲数量', len(songID))

count = 0
for i in range(0, len(songID)):
    songname = songName[i].replace('/', '').replace('"', '')
    file_path = "d:\\music\\{}.mp3".format(songname)  # 替换为你要检查的文件路径

    if os.path.exists(file_path):
        print(Fore.YELLOW, songname, "已存在，跳过下载")
    else:
        # songurl="https://music.jsbaidu.com/upload/128/2018/09/25/882059.mp3"   #构造歌曲url
        num = int(songID[i][0:2])+1
        songurl = "http://www.9ku.com/html/playjs/" + \
            str(num)+"/"+str(songID[i])+".js"
        try:
            data2 = requests.get(songurl, headers=header, timeout=10).text  # 增加超时和伪装头
        except requests.exceptions.RequestException as e:
            print(Fore.RED + f"请求 {songurl} 失败，原因：{e}")
            continue

        pat3 = '"wma":"(.*?)","m4a"'
        url2 = re.findall(pat3, data2)  # 从网页中获取所有歌曲ID
        url3 = url2[0]
        result_url = eval(repr(url3).replace('\\', ''))
        # print('https://music.jsbaidu.com' + result_url)
        # print(url3)
        data = requests.get('https://music.jsbaidu.com' + result_url).content

        try:
            with open("d:\\music\\{}.mp3".format(songname), "wb") as f:
                f.write(data)
                count = count + 1
                print(Fore.GREEN + "第", count, "首", songname, '下载成功')
        except Exception as e:
            print(Fore.RED + 'Request error:', e)

        time.sleep(0.5)