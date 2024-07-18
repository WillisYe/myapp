from PyQt5.Qt import *
from kugou_ui import Ui_widget
from my_spider import SpiderKugou
import os


class Window(QWidget, Ui_widget):
    def __init__(self):
        super(Window, self).__init__()
        self.setupUi(self)
        self.spider_kugou = SpiderKugou()
        self.play_url = []
        self.file_names = []
        self.save_path = os.path.join(os.getcwd(), 'saved')
        self.connect()

    def connect(self):
        self.pushButton_search.clicked.connect(self.show_result)
        self.lineEdit_search.returnPressed.connect(self.show_result)
        self.pushButton_clear.clicked.connect(self.result_clear)
        self.pushButton_modifypath.clicked.connect(self.set_save_path)
        self.pushButton_openpath.clicked.connect(self.open_save_path)
        self.listWidget.doubleClicked.connect(self.download_mp3)
        self.set_default_save_path()

    def set_default_save_path(self):
        self.lineEdit_path.setText(self.save_path)

    def show_result(self):
        input_info = self.lineEdit_search.text()
        try:
            self.spider_kugou.run(input_info)
            self.play_url = self.spider_kugou.play_url
            self.file_names = self.spider_kugou.file_names
            self.listWidget.clear()
            self.listWidget.addItems(self.spider_kugou.file_names)
            self.listWidget.setToolTip('双击下载')
        except KeyError:
            self.lineEdit_info.setText('请求次数过于频繁，请稍后再试！')

    def download_mp3(self):
        idx = self.listWidget.currentRow()
        download_url = self.play_url[idx]
        file_name = self.file_names[idx]
        try:
            os.makedirs(self.save_path)
        except:
            pass
        self.lineEdit_info.setText('正在下载%s.mp3...'%file_name)
        self.spider_kugou.save_mp3(download_url, self.save_path, file_name)
        self.lineEdit_info.clear()
        self.lineEdit_info.setText('%s下载完成'%file_name)

    def set_save_path(self):
        dirname = QFileDialog.getExistingDirectory(self, "浏览", '.')
        if dirname:
            self.lineEdit_path.setText(dirname)
            self.save_path = dirname

    def open_save_path(self):
        try:
            os.makedirs(self.save_path)
        except:
            pass
        os.startfile(os.path.normpath(self.save_path))

    def result_clear(self):
        self.listWidget.clear()


if __name__ == '__main__':
    import sys
    app = QApplication(sys.argv)
    window = Window()
    window.show()
    sys.exit(app.exec_())