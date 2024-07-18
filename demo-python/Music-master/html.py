import os
import requests
import re
import time
import json
from lxml import etree
from urllib import request
from colorama import init, Fore, Back, Style

init()

header = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'}

# page=int(input("请输入获取网页数量："))
songID = []  # 列表存放歌曲编号
songName = []  # 列表存放歌曲名字
songID1 = []  # 列表存放歌曲编号
# 构造url
for i in range(0, 1):
	url = "https://www.9ku.com/music/"
	url = "https://www.9ku.com/music/t_new.htm"
	req = request.Request(url, headers=header)
	data_html = request.urlopen(req).read().decode()
	# print(data_html)
	with open('index.html', 'w', encoding='utf-8') as file:
		file.write(data_html)