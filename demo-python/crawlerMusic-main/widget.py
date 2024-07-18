# This Python file uses the following encoding: utf-8

import os
import re
import sys
import requests
import urllib

from pathlib import Path
from bs4 import BeautifulSoup
from selenium import webdriver
from PySide2.QtWidgets import QApplication, QWidget, QPushButton, QTextEdit, QLineEdit, QLabel
from PySide2.QtCore import QFile, QTimer, QThread, Signal, Slot
from PySide2.QtUiTools import QUiLoader
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

import time
import asyncio

headers = {
    "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0"
    }

params = {
        'authority': 'www.kugou.com',
        'method': 'GET',
        'path': '/mixsong/1hiccibc.html',
        'scheme': 'https'
    }


## mp3filePath是否是mp3格式的
#def removeFailMp3():
#    # 读取文件内字符串
#    for filepath, dirnames, filenames in os.walk(r'./mp3'):
#        for filename in filenames:
#            filename = os.path.join(filepath, filename)
#            stats = os.stat(filename)
#            if stats.st_size == int(101831) or stats.st_size == 0:
#                os.remove(filename)
#                return False
#    return True


# 检测并删除非mp3格式的文件
def checkMp3File(fileStr):
    mp3Size = len(fileStr)
    print("开始检测 ", mp3Size)
    if mp3Size == int(101831) or mp3Size == 0:
        return False
    return True
#    if len(fileStr) < 35:
#        return False
#    head3Str = fileStr[:3]
#    # 判断开头是不是ID3
#    if head3Str == "ID3":
#        return True
#    # 判断结尾有没有TAG
#    last32Str = fileStr[-32:]
#    if last32Str[:3] == "TAG":
#        return True
#    # 判断第一帧是不是FFF开头, 转成数字
#    # fixme 应该循环遍历每个帧头，这样才能100%判断是不是mp3
#    ascii = ord(fileStr[:1])
#    if ascii == 255:
#        return True
#    return False


def getDataUrl(url):
    with requests.get(url, headers=headers) as response:
        if response.status_code == 200:
            return response
        else:
            return None

class Widget(QWidget):
    def __init__(self):
        super(Widget, self).__init__()
#        self.MyTimer = QTimer()
        self.index = 0
        self.songs_list = []
        self.load_ui()
        self.work = Thread()
        self.label = self.findChild(QLabel, "label")
        self.searchBtn = self.findChild(QPushButton, "pushButton_search")
        self.crawlerBtn = self.findChild(QPushButton, "pushButton_crawler")
        self.openMp3DirBtn = self.findChild(QPushButton, "pushButton_mp3dir")
        self.closeWgBtn = self.findChild(QPushButton, "pushButton_close")
        self.textEdit = self.findChild(QTextEdit, "textEdit")
        self.lineEditSong = self.findChild(QLineEdit, "lineEdit_song")
#        self.crawler.clicked.connect(self.get_rankList)
        self.searchBtn.clicked.connect(self.startSearh)
        self.lineEditSong.returnPressed.connect(self.startSearh)
        self.crawlerBtn.clicked.connect(self.startCrawler)
        self.closeWgBtn.clicked.connect(self.close)
        self.openMp3DirBtn.clicked.connect(self.openMp3Dir)
        self.work.finished.connect(self.finish)
        self.work.needer.sigDownload.connect(self.showInfo)
        self.work.needer.sigDownload.connect(self.showInfo)
        self.work.needer.sigFail.connect(self.addInfo)

# 酷狗排行榜
    def get_rankList(self):
        self.index += 1
        self.showInfo("第"+str(self.index)+"次,获取歌曲地址")
        host = "https://www.kugou.com/yy/rank/home/"
        url = host+"{}-8888.html".format(self.index)
        web_data = getDataUrl(url)
        soup = BeautifulSoup(web_data.text, 'lxml')
        ranks = soup.select('span.pc_temp_num')
        titles = soup.select('div.pc_temp_songlist > ul > li > a')
        times = soup.select('span.pc_temp_tips_r > span')
        for rank, title, time1 in zip(ranks, titles, times):
            data = {
                "rank": rank.get_text().strip(),
                "singer": title.get_text().replace("\n", "").replace("\t", "").split('-')[1],
                "song": title.get_text().replace("\n", "").replace("\t", "").split('-')[0],
                "time": time1.get_text().strip(),
                "url": title.get('href')
            }
            print("tile", title.get('href'))
            strData = str(data)
            self.textEdit.append(strData)
            # 获取歌曲
            songs_url = title.get('href')
            if songs_url != '':
                self.songs_list.append(data["singer"]+'|'+data["song"]+'|'+songs_url)
        # 启动任务
        if self.index == 23:
            print("启动任务,获取歌曲地址")
            self.showInfo("启动任务,获取歌曲地址")
#            self.MyTimer.stop()
            self.textEdit.append("\n\n正在下载歌曲...请勿关闭")
            self.work.init_songs(self.songs_list)
            self.work.quit()
            self.work.wait()
            self.work.start()

# 查找歌曲 网易云歌曲下载
    def startSearh(self):
        songname = self.lineEditSong.text()
        if songname == "":
            self.textEdit.clear()
            self.textEdit.append("\n查询内容不能为空")
            return
        url = "http://music.163.com/api/search/get/web?type=1&offset=0&total=true&limit=100&s=" + songname;
        r = getDataUrl(url)
        if r.text:  # 确保响应内容不为空
            print(r.text)
            webdata = r.json()
        else:
            print('Empty response')
        if len(webdata) == 0:
            return
        self.songs_list.clear()
        self.textEdit.clear()
        self.textEdit.append("\n歌曲列表如下:")
        idx = 0
        for info in webdata["result"]["songs"]:
            idx += 1
            url = "http://music.163.com/song/media/outer/url?id={}.mp3".format(info["id"])
            self.songs_list.append(info["artists"][0]["name"]+'|'+info["name"]+'|'+url)
            self.textEdit.append("\n第{}首歌曲:".format(idx)+info["name"]+ " 歌手:"+info["artists"][0]["name"]+" 下载地址:"+url)
        self.textEdit.append("\n共{}首歌曲".format(len(self.songs_list)))

# 开始爬取歌曲
    def startCrawler(self):
        self.showInfo("启动任务,获取歌曲地址")
        self.searchBtn.setEnabled(False)
        self.crawlerBtn.setEnabled(False)
#        self.MyTimer.stop()
        self.textEdit.append("\n\n正在下载歌曲...请勿关闭")
        self.work.init_songs(self.songs_list)
        self.work.quit()
        self.work.wait()
        self.work.start()

    def showInfo(self, hints):
        self.label.setText(hints)

    def addInfo(self, hints):
        self.textEdit.append("\n"+hints)

    def finish(self):
        self.textEdit.append("任务结束,详情查看mp3目录\n\n\n")
        self.showInfo("任务结束")
        self.searchBtn.setEnabled(True)
        self.crawlerBtn.setEnabled(True)

#    def startSearh(self):
#        self.MyTimer.start(100)
#        self.MyTimer.timeout.connect(self.searchSongs)

    def openMp3Dir(self):
        folder  = os.path.dirname(sys.executable)+"\\mp3"
        #方法1：通过start explorer
#        os.system("start explorer %s" %folder)
        # 方法2：通过startfile
        os.startfile(folder)



    def load_ui(self):
        loader = QUiLoader()
        path = os.path.realpath(os.curdir)+"/form.ui";# os.fspath(Path(__file__).resolve().parent / "form.ui")
        ui_file = QFile(path)
        ui_file.open(QFile.ReadOnly)
        loader.load(ui_file, self)
        ui_file.close()


class webman(QWidget):
    sigDownload = Signal(str)
    sigFail = Signal(str)

    def __init__(self):
        super().__init__()
        # 不开网页搜索 设置chrome浏览器无界面模式
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        s = Service(executable_path=r"C:\\Program Files\\Google\Chrome\\Application\\chromedriver.exe")
        self.browser = webdriver.Chrome(service=s, options=chrome_options)
        self.count = 0
        self.goodMp3Count = 0

    async def get_music(self, songdata):
        self.count += 1
        try:
            songinfo = songdata.split('|')
            print("网址信息: ", songdata, len(songinfo))
            if len(songinfo) < 3:
                return
            mp3name = os.path.join(os.path.dirname(sys.executable), 'mp3/{}.mp3'.format(songinfo[0]+"-"+songinfo[1]))
            mp3name = mp3name.replace(" ", "")
            if os.path.exists(mp3name):
                print("已经存在: ", mp3name)
                pass
            else:
                self.browser.get(songinfo[2])
#                await asyncio.sleep(1)
                time.sleep(0.5)
                audio = self.browser.find_element(By.CLASS_NAME, "music")
                mp3url = audio.get_attribute('src')
                print("正在下载: ", mp3name)
                urllib.request.urlretrieve(url=mp3url, filename=mp3name)
                self.sigDownload.emit("正在下载: " + mp3name)
            lrcName = os.path.join(os.path.dirname(sys.executable), 'mp3/{}.lrc'.format(songinfo[0]+"-"+songinfo[1]))
            lrcName = lrcName.replace(" ", "")
            if os.path.exists(lrcName):
                print("已经存在歌词文件: ", lrcName)
                pass
            else:
                lrcData = self.get_songsLRC(songinfo[0], songinfo[1])
                if lrcData != "":
                    with open(lrcName, 'w', encoding='utf_8_sig') as f:
                        lrcData = lrcData.replace("\\r\\n", "\n")
                        lrcData = lrcData.replace("\\n", "\n")
                        f.writelines(lrcData)
        finally:
            return

# 网易云下载
    async def get_musicWYY(self, songdata):
        self.count += 1
        try:
            songinfo = songdata.split('|')
            print("网址信息2: ", songdata, len(songinfo))
            if len(songinfo) < 2:
                return
            mp3url = songinfo[2]
            mp3name = os.path.join(os.path.dirname(sys.executable),'mp3/{}.mp3'.format(songinfo[0]+"-"+songinfo[1]))
            mp3name = mp3name.replace(" ", "")
            if os.path.exists(mp3name):
                print("已经存在: ", mp3name)
                pass
            else:
                self.goodMp3Count += 1
                r = requests.get(mp3url, stream=True)
                # 不满足mp3格式则不写入
                if checkMp3File(r.content) == False:
                    print(mp3name+"不满足mp3格式！！！")
                    self.sigFail.emit(mp3name+"下载失败(不满足mp3格式)")
                    return
                self.sigDownload.emit("正在下载(第{}文件): ".format(self.goodMp3Count) + mp3name)
                with open(mp3name, "wb") as f:
                    for bl in r.iter_content(chunk_size=1024):
                        if bl:
                            f.write(bl)
                    f.close()
                time.sleep(0.3)
                lrcName = os.path.join(os.path.dirname(sys.executable), 'mp3/{}.lrc'.format(songinfo[0]+"-"+songinfo[1]))
                lrcName = lrcName.replace(" ", "")
                if os.path.exists(lrcName):
                    print("已经存在歌词文件: ", lrcName)
                    pass
                else:
                    lrcData = self.get_songsLRC(songinfo[0], songinfo[1])
                    if lrcData != "":
                        with open(lrcName, 'w', encoding='utf_8_sig') as f:
                            lrcData = lrcData.replace("\\r\\n", "\n")
                            lrcData = lrcData.replace("\\n", "\n")
                            f.writelines(lrcData)

        finally:
            return

    # 从www.8lrc.com爬取歌曲 按歌曲或歌手
    def get_songsLRC(self, singer, songsName):
        host = "https://www.8lrc.com"
        url = host+"/search/?key="+songsName
        web_data = getDataUrl(url)
        soup = BeautifulSoup(web_data.text, 'lxml')
        lrcList = soup.select('div.cicont > h2 > a')
        if len(lrcList) == 0:
            return ""
        lrcUrl = ""
        for lrc in lrcList:
            if lrc.get_text() == singer:
                lrcUrl = lrc.get('href')
                break
        if lrcUrl == "":
            lrcUrl = lrcList[0].get('href')
        lrcUrl = host+lrcUrl
        print(songsName+'歌词地址:', lrcUrl)
        web_data = getDataUrl(lrcUrl)
        soup2 = BeautifulSoup(web_data.text, 'lxml')
        lrcWord2 = soup2.select('div.ciInfo > script')
        pattern = r"\"\[(.*?)\"\;"
        results = re.search(pattern, str(lrcWord2))
        if results:
            return "["+results.group(1)
        return ""

    def finished(self):
        self.browser.quit()
        print("异步任务已完成")


# 继承QThread
class Thread(QThread):
    def __init__(self):
        super().__init__()
        self.urllist = []
        self.needer = webman()

    def init_songs(self, list):
        self.urllist = list

    def run(self):
        new_loop = asyncio.new_event_loop()
        asyncio.set_event_loop(new_loop)
        loop = asyncio.get_event_loop()
#        tasks = [needer.get_music(song) for song in self.urllist]
        tasks = [self.needer.get_musicWYY(song) for song in self.urllist]
        wait_coro = asyncio.wait(tasks)
        loop.run_until_complete(wait_coro)
        loop.close()
        if len(self.urllist) <= self.needer.count:
            self.needer.finished()
            self.quit()


if __name__ == "__main__":
    app = QApplication([])
    path = os.path.dirname(sys.executable)+"\\mp3"
    print(path)
    if os.path.isdir(path):
        pass
    else:
        os.makedirs(path)
    widget = Widget()
    widget.show()
    sys.exit(app.exec_())

