# crawler about
from fake_useragent import UserAgent
from selenium import webdriver
import requests
from pyquery import PyQuery as pq
import pandas as pd
import jsonpath
import random
import time
import re
# wordcloud about
import numpy as np
import PIL.Image as Image
from wordcloud import WordCloud, ImageColorGenerator

ua = UserAgent()
headers = {'User-Agent': ua.random}
fo_num = 0  # 关注人数，全局变量，默认设置为0


def follow_list(user_id):
    url = 'https://music.163.com/#/user/follows?id=' + user_id
    driver = webdriver.Chrome()
    driver.get(url)
    driver.switch_to.frame('g_iframe')
    fo_num_temp = driver.find_element_by_css_selector('#tab-box > li:nth-child(2) > a > strong')
    global fo_num
    fo_num = int(re.search(r'\d+', fo_num_temp.text).group())  # 更新关注人数，第二步的循环总量
    fo_page = pq(driver.page_source)
    data1 = get_follow(fo_page)
    for i in range(1, int(fo_num/20)+1):
        input_search = driver.find_element_by_link_text("下一页")
        driver.execute_script("arguments[0].click();", input_search)
        time.sleep(1)
        fo_page = pq(driver.page_source)
        data2 = get_follow(fo_page)
        data1 = data1 + data2
    driver.quit()
    temp = pd.DataFrame(data1)
    temp.to_csv("user_data_fo.csv", index_label="index_label", encoding='utf-8-sig')
    return data1


def get_follow(fo_page):
    data = []
    for i in range(1, 21):
        home_page = fo_page('#main-box > li:nth-child(' + str(i) + ') > a').attr('href')
        nickname = fo_page('#main-box > li:nth-child(' + str(i) + ') > a').attr('title')
        dic = {}
        dic['home_page'] = home_page
        dic['nickname'] = nickname
        data.append(dic)
    return data


def get_list(home_page):
    home_url = 'http://music.163.com'
    url = home_url + home_page
    driver = webdriver.Chrome()
    driver.get(url)
    driver.switch_to.frame('g_iframe')
    for n in range(6):  # 若要使用滚动到底功能，浏览器不能最小化，将vscode放置在当前页即可
        driver.execute_script("window.scrollTo(0,document.body.scrollHeight)")  # 滚动到底部,滚动次数和sleep时间为经验值设置为6次和20s，页面一次加载7行歌单？
        time.sleep(5)
    page = driver.page_source
    c_num_temp = driver.find_element_by_css_selector('#cHeader > h3 > span')
    c_num = c_num_temp.text.split('创建的歌单')[1]
    Sum_List = int(re.search(r'\d+', c_num).group())
    print(Sum_List)
    list1 = []
    doc = pq(page)  # page为iframe爬取结果，str型数据，已知参数传入
    for i in range(1, Sum_List+1):  # 用户总歌单数
        a = doc('#cBox > li:nth-child(' + str(i) + ') > div > a').attr('href')  # part1的格式为：“/playlist?id=2756016752”
        print(a)
        a1 = 'https://music.163.com/api' + a.replace('?', '/detail?')  # 此接口的格式为：“https://music.163.com/api/playlist/detail?id=2756016752”
        print(a1)
        list1.append(a1)
        time.sleep(2+random.random())
        print(i)
    driver.quit()
    return list1


def get_playlist(url):
    data = []
    doc = get_json(url)
    if doc['code'] == 404:
        return data
    else:
        jobs = doc['result']['tracks']
        for job in jobs:
            dic = {}
            dic['song'] = jsonpath.jsonpath(job, '$..name')[0]  # 歌曲名称
            dic['artist'] = jsonpath.jsonpath(job, '$..name')[1]  # 歌手
            dic['album'] = jsonpath.jsonpath(job, '$..name')[2]  # 专辑
            data.append(dic)
        return data


def get_json(url):
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            json_text = response.json()
            return json_text
    except Exception:
        print('error!')
        return None


def statistics(n):
    data = pd.read_csv("user_data_" + str(n) + ".csv", header=0, encoding="utf-8")
    if len(data.song.values) == 0:
        print('null in playlist')
    else:
        dic = {}
        for k in data.artist:
            if k not in dic:
                dic[k] = 0
            dic[k] += 1
        wd = WordCloud(background_color="white",
                       font_path='C:/Windows/Fonts/simfang.ttf',
                       mask=np.array(Image.open("paprika.jpg"))).generate_from_frequencies(dic)
        image_colors = ImageColorGenerator(np.array(Image.open("paprika.jpg")))
        wd.recolor(color_func=image_colors)
        image_produce = wd.to_image()
        image_produce.show()
        image_produce.save("mywordcloud_" + str(n) + ".jpg")


def power_data():
    data_original = pd.read_csv('user_data_0.csv', header=0, encoding="utf-8")
    data_original_song = data_original.song.values  # 基准
    data = []
    for i in range(1, fo_num+1):
        data_target = pd.read_csv('user_data_' + str(i) + '.csv', header=0, encoding="utf-8")
        data_target_song = data_target.song.values
        commonsong = set(data_target_song).intersection(set(data_original_song))
        dic = {}
        dic['user'] = i
        dic['power'] = len(commonsong)
        data.append(dic)
    a = pd.DataFrame(data)
    a.to_csv("power.csv", index_label="index_label", encoding='utf-8-sig')


def get_song(playlist_url, k):
    data = pd.DataFrame(columns=('song', 'artist', 'album'))
    for i in playlist_url[0:]:
        print(i)
        playlist = get_playlist(i)
        a = pd.DataFrame(playlist)

        time.sleep(5+random.random())
        data = pd.concat([data, a])
        data1 = data.drop_duplicates(subset=None, keep='first', inplace=False)  # 去重
        data1.to_csv("user_data_" + str(k) + ".csv", index_label="index_label", encoding='utf-8-sig')


user_id = input('输入用户id：')
follow_info = follow_list(user_id)  # 关注用户的信息，格式为：[{url:***, id:***}，***]
print('follow_info success')
for k in range(1, fo_num+1):
    home_page = follow_info[k-1]['home_page']
    playlist_url = get_list(home_page)  # 输入变量已修改
    get_song(playlist_url, k)
    statistics(k)

user_id_input = '/user/home?id=' + user_id
user_playlist_url = get_list(user_id_input)
get_song(user_playlist_url, 0)
statistics(0)

power_data()
