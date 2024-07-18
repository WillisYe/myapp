import time
from fake_useragent import UserAgent
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
from bs4 import BeautifulSoup
import pandas as pd


def get_comment_back(id):
    total_result = []
    url = 'https://music.163.com/#/song?id=' + str(id)

    # chrome
    # option = webdriver.ChromeOptions()
    # option.add_argument('--ignore-certificate-errors')
    # option.add_experimental_option('excludeSwitches', ['enable-logging'])
    # driver = webdriver.Chrome(chrome_options=option)

    # firefox
    opt = webdriver.FirefoxOptions()
    opt.add_argument("--headless")
    opt.add_argument("--disable-gpu")
    driver = webdriver.Firefox(options=opt)
    driver.get(url)

    # 转换iframe
    wait = WebDriverWait(driver, 20)
    wait.until(EC.frame_to_be_available_and_switch_to_it(driver.find_element(By.ID, "g_iframe")))
    # driver.switch_to.frame('g_iframe')

    # 获取总评论数及总页数
    comm_num = driver.find_element(By.CSS_SELECTOR, '#comment-box > div > div > span > span')
    if (int(comm_num.text)/20) % 1 == 0:
        page_num = int(int(comm_num.text)/20)
    else:
        page_num = int(int(comm_num.text)/20)+1
    print(page_num)
    input_search = driver.find_element(By.LINK_TEXT, str(page_num))
    driver.execute_script("arguments[0].click();", input_search)
    time.sleep(5)

    # 读取最后一页内容并写入total_result
    page = driver.page_source
    result = bs4function(page)
    total_result = total_result + result

    # 跳转到上一页后获取页面内容，并循环执行
    for i in range(1, page_num):
        print('开始加载第%d页' % (page_num-i))
        input_search = driver.find_element(By.LINK_TEXT, "上一页")
        driver.execute_script("arguments[0].click();", input_search)
        time.sleep(10)
        page = driver.page_source
        result1 = bs4function(page)
        total_result = total_result + result1
    driver.quit()

    # 另存为EXCEL
    total_result = pd.DataFrame(total_result)
    total_result.to_csv("wyy_comm_data_back_" + str(id) + ".csv", index_label="index_label", encoding='utf-8-sig')
    print('%s success' % str(id))


def bs4function(page):
    ua = UserAgent()
    header = {'User-Agent': ua.random}
    result = []
    bs = BeautifulSoup(page, "lxml")
    a = bs.find_all('div', class_='itm')
    n = len(a)
    for j in range(1, n+1):
        dict1 = {}
        b = a[j-1]
        user_id = b.select('.cntwrap > div > div > a')[0].attrs['href'].replace('/user/home?id=', '')
        dict1['user_id'] = user_id  # user
        print(user_id)
        dict1['comment'] = b.select('.cntwrap > div > div')[0].get_text().split('：')[1]  # comments
        dict1['comment_time'] = b.select('.cntwrap > div > div')[1].get_text()  # time

        comment_user_url = 'https://music.163.com/api/v1/user/detail/' + str(user_id)
        comment_user_profile = get_json(comment_user_url, header)
        if comment_user_profile['code'] != 200:
            dict1['user_gender'] = 0
            dict1['create_time'] = 0
            dict1['user_age'] = 0
            dict1['province'] = 0
            dict1['follower'] = 0
            dict1['following'] = 0
            dict1['event'] = 0
            dict1['playlist'] = 0
            dict1['subscribe'] = 0
        else:
            dict1['user_gender'] = comment_user_profile['profile']['gender']
            dict1['create_time'] = comment_user_profile['profile']['createTime']
            dict1['user_age'] = comment_user_profile['profile']['birthday']
            dict1['province'] = comment_user_profile['profile']['province']
            dict1['follower'] = comment_user_profile['profile']['followeds']
            dict1['following'] = comment_user_profile['profile']['follows']
            dict1['event'] = comment_user_profile['profile']['eventCount']
            dict1['playlist'] = comment_user_profile['profile']['playlistCount']
            dict1['subscribe'] = comment_user_profile['profile']['playlistBeSubscribedCount']
        print(dict1)
        result.append(dict1)
    return result


def get_comment(song_id):
    url_web = 'https://music.163.com/#/song?id=' + str(song_id)
    driver = webdriver.Chrome()
    driver.get(url_web)
    driver.switch_to.frame('g_iframe')
    comm_num = driver.find_element_by_css_selector('#comment-box > div > div > span > span')
    page_num = int(int(comm_num.text)/20)+1
    print(page_num)
    driver.quit()
    total_data = []
    for i in range(1, page_num+1):
        url = 'http://music.163.com/api/v1/resource/comments/R_SO_4_' + str(song_id) + '?limit=20&offset=' + str((i-1)*20)
        doc = get_json(url)
        data = []
        if doc['code'] == 404:
            return data
        else:
            jobs = doc['comments']
            for job in jobs:
                dic1 = {}
                dic1['user_id'] = job['user']['userId']
                dic1['comment'] = job['content']
                dic1['comment_time'] = job['time']

                comment_user_id = job['user']['userId']
                print(comment_user_id)
                comment_user_url = 'https://music.163.com/api/v1/user/detail/' + str(comment_user_id)
                comment_user_profile = get_json(comment_user_url)
                if comment_user_profile['code'] != 200:
                    dic1['user_gender'] = 0
                    dic1['create_time'] = 0
                    dic1['user_age'] = 0
                    dic1['province'] = 0
                    dic1['follower'] = 0
                    dic1['following'] = 0
                    dic1['event'] = 0
                    dic1['playlist'] = 0
                    dic1['subscribe'] = 0
                else:
                    dic1['user_gender'] = comment_user_profile['profile']['gender']
                    dic1['create_time'] = comment_user_profile['profile']['createTime']
                    dic1['user_age'] = comment_user_profile['profile']['birthday']
                    dic1['province'] = comment_user_profile['profile']['province']
                    dic1['follower'] = comment_user_profile['profile']['followeds']
                    dic1['following'] = comment_user_profile['profile']['follows']
                    dic1['event'] = comment_user_profile['profile']['eventCount']
                    dic1['playlist'] = comment_user_profile['profile']['playlistCount']
                    dic1['subscribe'] = comment_user_profile['profile']['playlistBeSubscribedCount']
                print(dic1)
                data.append(dic1)
        total_data = total_data + data
        print('第%d页加载完成' % (i))
    print(total_data)
    a = pd.DataFrame(total_data)
    a.to_csv("comm_data_" + song_id + ".csv", index_label="index_label", encoding='utf-8-sig')
    print('success')


def get_json(url, header):
    try:
        print(header)
        response = requests.get(url, headers=header)
        if response.status_code == 200:
            json_text = response.json()
            return json_text
    except Exception:
        print('error!')
        return None


def getSongsId(albumInfo):
    songsList = []
    if albumInfo['code'] == 200:
        count = len(albumInfo["songs"])
        for i in range(0, count):
            songsList.append(albumInfo['songs'][i]['id'])
        return songsList
    else:
        print("error")
        return songsList


if __name__ == '__main__':

    mode = int(input('enter mode type(1 for single/2 for album):'))
    id = int(input('enter id:'))
    if mode == 1:
        get_comment_back(id)
    elif mode == 2:
        ua = UserAgent()
        header = {'User-Agent': ua.random}
        url = 'https://api.obfs.dev/api/netease/album?id=' + str(id)
        result = get_json(url, header)
        song_list = getSongsId(result)
        for i in range(1, len(song_list)+1):
            get_comment_back(str(song_list[i-1]))
    else:
        print('mode error')
