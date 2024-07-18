from fake_useragent import UserAgent
from selenium import webdriver
import requests
from pyquery import PyQuery as pq
import pandas as pd
import jsonpath
import time
import re
import numpy as np
import PIL.Image as Image
from wordcloud import WordCloud, ImageColorGenerator


def get_list(url):
    try:
        driver = webdriver.Chrome()
        driver.get(url)
        driver.switch_to.frame('g_iframe')
        for n in range(6):
            driver.execute_script("window.scrollTo(0,document.body.scrollHeight)")
            time.sleep(2)
        page = driver.page_source
        c_num_temp = driver.find_element_by_css_selector('#cHeader > h3 > span')
        c_num = c_num_temp.text.split('创建的歌单')[1]
        Sum_List = int(re.search(r'\d+', c_num).group())
        print(Sum_List)
        list1 = []
        doc = pq(page)
        for i in range(1, Sum_List+1):
            a = doc('#cBox > li:nth-child(' + str(i) + ') > div > a').attr('href')
            print(a)
            a1 = 'https://music.163.com/api' + a.replace('?', '/detail?')
            print(a1)
            list1.append(a1)
            time.sleep(2)
            print(i)
        driver.quit()
        return list1
    except Exception as e:
        print('error:%s' % e)


def get_song(playlist_url):
    data = pd.DataFrame(columns=('song', 'artist', 'album'))
    for i in playlist_url[0:]:
        print(i)
        playlist = get_playlist(i)
        a = pd.DataFrame(playlist)
        time.sleep(2)
        data = pd.concat([data, a])
        data1 = data.drop_duplicates(subset=None, keep='first', inplace=False)  # 去重
        data1.to_csv("user_totalsongs.csv", index_label="index_label", encoding='utf-8-sig')
    if len(data1.song.values) == 0:
        print('null in playlist')
        return 'null in playlist'
    else:
        dic = {}
        for k in data1.artist:
            if k not in dic:
                dic[k] = 0
            dic[k] += 1
        df_temp = pd.DataFrame.from_dict(dic, orient='index')
        df_temp = df_temp.reset_index()
        df_temp.to_csv("songs_playlist.csv", index_label="index_label", encoding='utf-8-sig')
        print(df_temp)
        return df_temp


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


def rank(id):
    try:
        url = 'https://music.163.com/user/songs/rank?id=' + id
        driver = webdriver.Chrome()
        driver.get(url)
        driver.switch_to.frame('g_iframe')
        input_search = driver.find_element_by_id("songsall")
        driver.execute_script("arguments[0].click();", input_search)
        time.sleep(2)
        page = driver.page_source
        driver.quit()
        doc = pq(page)
        data = doc('#m-record')
        var = []
        for i in range(1, 101):
            dic = {}
            dic['range'] = i
            dic['song'] = data('li:nth-child(' + str(i) + ') > .song > .tt > .ttc > .txt > a > b').attr('title')
            if dic['song'] is None:
                break
            dic['artist'] = data('li:nth-child(' + str(i) + ') > .song > .tt > .ttc > .txt > span > span').attr('title')
            temp = data('li:nth-child(' + str(i) + ') > .tops >  span').attr('style')
            dic['frequency'] = int(re.findall(r'\d+\.?\d*', temp)[0])
            var.append(dic)
        var = pd.DataFrame(var)
        c = var[['artist', 'frequency']].groupby(['artist'], as_index=False).agg({'frequency': sum})
        c.sort_values(['frequency'], ascending=False, inplace=True)
        c.to_csv("songs_rank.csv", index_label="index_label", encoding='utf-8-sig')
        print(c)
        return c
    except Exception as e:
        print('error:%s' % e)
        error = 'user blocked rank list'
        print(error)
        return error


def combine_f(df1, df2, mode):
    try:
        if mode == 1:
            df1.rename(columns={'index': 'artist', 0: 'power'}, inplace=True)
            print(df1)
            dic = dict(zip(df1.artist, df1.power))
            return dic
        elif mode == 2:
            df1.rename(columns={'index': 'artist', 0: 'power'}, inplace=True)
            df2.rename(columns={'frequency': 'power'}, inplace=True)
            df2.loc[:, 'power'] = df2.loc[:, 'power']/15
            print(df1)
            print(df2)
            for k in range(0, len(df1)):
                for j in range(0, len(df2)):
                    if df2.artist[j] == df1.artist[k]:
                        df1.loc[k, 'power'] = int(df1.loc[k, 'power']) + int(df2.loc[j, 'power'])
                        break
                    else:
                        continue
            df3 = pd.concat([df1, df2])
            df3 = df3.drop_duplicates(subset='artist', keep='first', inplace=False)
            dic = dict(zip(df3.artist, df3.power))
            return dic
        else:
            print("please change an ID")
    except Exception as e:
        print('error:%s' % e)


def draw_pic(dic):
    wd = WordCloud(background_color="white",
                   font_path='C:/Windows/Fonts/simfang.ttf',
                   mask=np.array(Image.open("paprika.jpg"))).generate_from_frequencies(dic)
    image_colors = ImageColorGenerator(np.array(Image.open("paprika.jpg")))
    wd.recolor(color_func=image_colors)
    image_produce = wd.to_image()
    image_produce.show()
    image_produce.save("mywordcloud.jpg")


if __name__ == "__main__":
    ua = UserAgent()
    headers = {'User-Agent': ua.random}

    user_id = input('输入用户id：')
    url = 'https://music.163.com/user/home?id=' + user_id

    playlist_url = get_list(url)  # 统计歌单
    df1 = get_song(playlist_url)  # 歌单数据
    df2 = rank(user_id)  # 排行榜数据
    if isinstance(df2, str):
        dic = combine_f(df1, df2, 1)  # mode1 仅有歌单数据
        draw_pic(dic)  # 画图
    else:
        dic = combine_f(df1, df2, 2)  # mode2 合并歌单数据和排行榜数据
        draw_pic(dic)  # 画图
