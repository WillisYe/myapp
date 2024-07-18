import requests
import os
import json


class SpiderKugou(object):
    def __init__(self):
        self.header = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'}
        self.play_url = []
        self.file_names = []

    def run(self, input_text):
        hash_urls = self.get_serach_result(input_text)
        temp_file_names = []
        temp_play_url = []
        for i in hash_urls:
            file_name, play_url = self.get_song_url(i)
            temp_file_names.append(file_name)
            temp_play_url.append(play_url)
        self.file_names = temp_file_names
        self.play_url = temp_play_url

    def get_serach_result(self, input_text):
        url = 'https://songsearch.kugou.com/song_search_v2?callback=jQuery112409233009428201582_1580529885252&keyword={} \
               &page=1&pagesize=30&userid=-1&clientver=&platform=WebFilter&tag=em&filter=2 \
               &iscorrection=1&privilege_filter=0&_=1580529885254'.format(input_text)
        response = requests.get(url, headers=self.header).text

        js = json.loads(response[response.index('(') + 1:-2])
        mp3s_info = js['data']['lists']
        hash_urls = []
        for mp3 in mp3s_info:
            temp_url = 'https://wwwapi.kugou.com/yy/index.php?r=play/getdata&callback=jQuery19104171570549157364_1580539237941&' \
                        'hash={}&' \
                        'album_id={}&dfid=4WKjEa4M1QAR0fbVsG3RbTV0&' \
                        'mid=410b614c11a6c72ef6a23073ba557221&platid=4&_=1580539237942'.format(mp3['FileHash'], mp3['AlbumID'])
            hash_urls.append(temp_url)
        return hash_urls

    def get_song_url(self, url):
        response = requests.get(url, headers=self.header).text
        js = json.loads(response[response.index('(') + 1:-2], encoding='utf-8')
        audio_name = js['data']['audio_name']
        play_url = js['data']['play_url']
        return audio_name, play_url

    def save_mp3(self, url, save_path, file_name):
        mp3_url = url.replace('\\', '')
        respnse = requests.get(mp3_url)
        with open(os.path.join(save_path, file_name+'.mp3'), 'wb') as m:
            m.write(respnse.content)


if __name__ == '__main__':
    a = SpiderKugou()
    a.run('下山')
    print(a.file_names)
    print(a.play_url)
    # a.save_mp3(a.play_url[2], 'mp3', a.file_names[2])
    # a.save_mp3('https:\/\/webfs.cloud.kugou.com\/202002011228\/a9cf7c58ae768057ac575ec1a320682d\/G176\/M00\/0E\/19\/kJQEAF3t8saAFZfRACp_ieCrn2g443.mp3', save_path='mp3', file_name='111.mp3')