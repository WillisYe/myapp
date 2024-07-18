# -*- coding:utf-8 -*-
import requests
import hashlib
import sys
import click
import re
import base64
import binascii
import json
import os
from Crypto.Cipher import AES
from http import cookiejar

class Encrypyed():
    def __init__(self):
        self.modulus = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7'
        self.nonce = '0CoJUm6Qyw8W8jud'
        self.pub_key = '010001'

    def encrypted_request(self, text):
        text = json.dumps(text)
        sec_key = self.create_secret_key(16)
        enc_text = self.aes_encrypt(self.aes_encrypt(text, self.nonce), sec_key.decode('utf-8'))
        enc_sec_key = self.rsa_encrpt(sec_key, self.pub_key, self.modulus)
        data = {'params': enc_text, 'encSecKey': enc_sec_key}
        return data

    def aes_encrypt(self, text, secKey):
        pad = 16 - len(text) % 16
        text = text + chr(pad) * pad
        encryptor = AES.new(secKey.encode('utf-8'), AES.MODE_CBC, b'0102030405060708')
        ciphertext = encryptor.encrypt(text.encode('utf-8'))
        ciphertext = base64.b64encode(ciphertext).decode('utf-8')
        return ciphertext

    def rsa_encrpt(self, text, pubKey, modulus):
        text = text[::-1]
        rs = pow(int(binascii.hexlify(text), 16), int(pubKey, 16), int(modulus, 16))
        return format(rs, 'x').zfill(256)

    def create_secret_key(self, size):
        return binascii.hexlify(os.urandom(size))[:16]

class Song():
    def __init__(self, song_id, song_name, song_num, song_url=None):
        self.song_id = song_id
        self.song_name = song_name
        self.song_num = song_num
        self.song_url = '' if song_url is None else song_url

class Crawler():
    def __init__(self, timeout=60, cookie_path='.'):
        self.headers = {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip,deflate,sdch',
            'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'music.163.com',
            'Referer': 'http://music.163.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 QQBrowser/10.4.1',
        }
        self.timeout = timeout
        self.cookie_path = cookie_path
        self.session = requests.Session()
        self.session.cookies = cookiejar.LWPCookieJar(filename='163music.cookie')
        self.encrypted = Encrypyed()
        self.modulus = self.encrypted.modulus
        self.nonce = self.encrypted.nonce
        self.pub_key = self.encrypted.pub_key
        self.headers = {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip,deflate,sdch',
            'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'music.163.com',
            'Referer': 'http://music.163.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 QQBrowser/10.4.1',
        }
        self.timeout = timeout
        self.cookie_path = cookie_path
        self.session = requests.Session()
        self.session.cookies = cookiejar.LWPCookieJar(filename='163music.cookie')
        self.encrypted = Encrypyed()
        self.modulus = self.encrypted.modulus
        self.nonce = self.encrypted.nonce
        self.pub_key = self.encrypted.pub_key

    def search_song(self, song_name, song_num, quiet=True):
        url = 'http://music.163.com/weapi/cloudsearch/get/web?csrf_token='
        params = {
            's': song_name,
            'type': 1,
            'offset': 0,
            'sub': 'false',
            'limit': song_num
        }
        data = self.encrypted.encrypted_request(params)
        resp = self.session.post(url, data=data, headers=self.headers, timeout=self.timeout)
        result = resp.json()
        songs = result['result']['songs']
        if len(songs) > 0:
            song = songs[0]
            song_id = song['id']
            song_name = song['name']
            song_num = song_num
            return Song(song_id, song_name, song_num)
        else:
            if not quiet:
                click.echo('Can not find the song %s' % song_name)
            return None

    def get_song_url(self, song_id):
        url = 'http://music.163.com/weapi/song/enhance/player/url?csrf_token='
        params = {'ids': [song_id], 'br': 320000, 'csrf_token': ''}
        data = self.encrypted.encrypted_request(params)
        resp = self.session.post(url, data=data, headers=self.headers, timeout=self.timeout)
        result = resp.json()
        song_url = result['data'][0]['url']
        return song_url

    def get_song_by_url(self, song_url, song_name, song_num, folder='.'):
        fpath = os.path.join(folder, str(song_num) + '_' + song_name + '.mp3')
        if not os.path.exists(fpath):
            resp = self.session.get(song_url, timeout=self.timeout, stream=True)
            length = int(resp.headers.get('content-length'))
            label = 'Downloading {} {}kb'.format(song_name, int(length/1024))

            with click.progressbar(length=length, label=label) as progressbar:
                with open(fpath, 'wb') as song_file:
                    for chunk in resp.iter_content(chunk_size=1024):
                        if chunk:
                            song_file.write(chunk)
                            progressbar.update(1024)

    def download_song_by_search(self, song_name, song_num, folder='.'):
        song = self.get_song_by_search(song_name)
        if song:
            song_url = self.get_song_url(song.song_id)
            self.get_song_by_url(song_url, song.song_name, song.song_num, folder)
        else:
            click.echo('Can not find the song %s' % song_name)

    def download_song_by_id(self, song_id, song_name, song_num, folder='.'):
        song_url = self.get_song_url(song_id)
        self.get_song_by_url(song_url, song_name, song_num, folder)

    def download_song_by_list(self, music_list_name):
        if os.path.exists(music_list_name):
            with open(music_list_name, 'r') as f:
                music_list = list(map(lambda x: x.strip(), f.readlines()))
            for song_num, song_name in enumerate(music_list):
                self.download_song_by_search(song_name, song_num + 1)
        else:
            click.echo('music_list.txt not exist.')

    def download_song_by_top(self, top_id, folder='.'):
        music_list = self.get_top_song_list(top_id)
        for song_num, song in enumerate(music_list):
            song_url = self.get_song_url(song.song_id)
            self.get_song_by_url(song_url, song.song_name, song_num + 1, folder)

    def download_song_by_artist(self, artist_id, folder='.'):
        music_list = self.get_artist_song_list(artist_id)
        for song_num, song in enumerate(music_list):
            song_url = self.get_song_url(song.song_id)
            self.get_song_by_url(song_url, song.song_name, song_num + 1, folder)

    def download_song_by_album(self, album_id, folder='.'):
        music_list = self.get_album_song_list(album_id)
        for song_num, song in enumerate(music_list):
            song_url = self.get_song_url(song.song_id)
            self.get_song_by_url(song_url, song.song_name, song_num + 1, folder)

    def download_song_by_playlist(self, playlist_id, folder='.'):
        music_list = self.get_playlist_song_list(playlist_id)
        for song_num, song in enumerate(music_list):
            song_url = self.get_song_url(song.song_id)
            self.get_song_by_url(song_url, song.song_name, song_num + 1, folder)

class Netease():
    def __init__(self, timeout=60, folder='Musics', quiet=True, cookie_path='Cookie'):
        self.crawler = Crawler(timeout, cookie_path)
        self.folder = '.' if folder is None else folder
        self.quiet = quiet

    def download_song_by_search(self, song_name, song_num):
        try:
            song = self.crawler.search_song(song_name, song_num, self.quiet)
        except:
            click.echo('download_song_by_serach error')
        if song is not None:
            self.crawler.download_song_by_id(song.song_id, song.song_name, song.song_num, self.folder)

    def download_song_by_id(self, song_id, song_name, song_num, folder='.'):
        try:
            url = self.crawler.get_song_url(song_id)
            song_name = song_name.replace('/', '')
            song_name = song_name.replace('.', '')
            self.crawler.get_song_by_url(url, song_name, song_num, folder)
        except:
            click.echo('download_song_by_id error')


if __name__ == '__main__':
    timeout = 60
    output = 'Musics'
    quiet = True
    cookie_path = 'Cookie'
    netease = Netease(timeout, output, quiet, cookie_path)
    music_list_name = 'music_list.txt'
    if os.path.exists(music_list_name):
        with open(music_list_name, 'r') as f:
            music_list = list(map(lambda x: x.strip(), f.readlines()))
        for song_num, song_name in enumerate(music_list):
            netease.download_song_by_search(song_name, song_num)
    else:
        click.echo('music_list.txt not exist.')