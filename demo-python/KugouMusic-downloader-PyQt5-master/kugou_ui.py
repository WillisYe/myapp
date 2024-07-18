# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'kugou.ui'
#
# Created by: PyQt5 UI code generator 5.13.0
#
# WARNING! All changes made in this file will be lost!


from PyQt5 import QtCore, QtGui, QtWidgets


class Ui_widget(object):
    def setupUi(self, widget):
        widget.setObjectName("widget")
        widget.resize(500, 400)
        widget.setMinimumSize(QtCore.QSize(500, 400))
        widget.setMaximumSize(QtCore.QSize(500, 400))
        self.verticalLayout = QtWidgets.QVBoxLayout(widget)
        self.verticalLayout.setSpacing(0)
        self.verticalLayout.setObjectName("verticalLayout")
        self.frame = QtWidgets.QFrame(widget)
        self.frame.setFrameShape(QtWidgets.QFrame.StyledPanel)
        self.frame.setFrameShadow(QtWidgets.QFrame.Raised)
        self.frame.setObjectName("frame")
        self.horizontalLayout = QtWidgets.QHBoxLayout(self.frame)
        self.horizontalLayout.setObjectName("horizontalLayout")
        self.lineEdit_search = QtWidgets.QLineEdit(self.frame)
        self.lineEdit_search.setMinimumSize(QtCore.QSize(0, 25))
        self.lineEdit_search.setMaximumSize(QtCore.QSize(16777215, 25))
        font = QtGui.QFont()
        font.setPointSize(10)
        self.lineEdit_search.setFont(font)
        self.lineEdit_search.setClearButtonEnabled(True)
        self.lineEdit_search.setObjectName("lineEdit_search")
        self.horizontalLayout.addWidget(self.lineEdit_search)
        self.pushButton_search = QtWidgets.QPushButton(self.frame)
        self.pushButton_search.setMinimumSize(QtCore.QSize(0, 25))
        self.pushButton_search.setStyleSheet("QPushButton {\n"
"    background-color: rgb(203, 203, 203);\n"
"}\n"
"QPushButton:hover {\n"
"    background-color: rgb(152, 152, 152);\n"
"}\n"
"QPushButton:pressed {\n"
"    background-color: rgb(118, 118, 118);\n"
"}")
        self.pushButton_search.setObjectName("pushButton_search")
        self.horizontalLayout.addWidget(self.pushButton_search)
        self.pushButton_clear = QtWidgets.QPushButton(self.frame)
        self.pushButton_clear.setMinimumSize(QtCore.QSize(0, 25))
        self.pushButton_clear.setStyleSheet("QPushButton {\n"
"    background-color: rgb(203, 203, 203);\n"
"}\n"
"QPushButton:hover {\n"
"    background-color: rgb(152, 152, 152);\n"
"}\n"
"QPushButton:pressed {\n"
"    background-color: rgb(118, 118, 118);\n"
"}")
        self.pushButton_clear.setObjectName("pushButton_clear")
        self.horizontalLayout.addWidget(self.pushButton_clear)
        self.verticalLayout.addWidget(self.frame)
        self.frame_3 = QtWidgets.QFrame(widget)
        self.frame_3.setFrameShape(QtWidgets.QFrame.StyledPanel)
        self.frame_3.setFrameShadow(QtWidgets.QFrame.Raised)
        self.frame_3.setObjectName("frame_3")
        self.horizontalLayout_2 = QtWidgets.QHBoxLayout(self.frame_3)
        self.horizontalLayout_2.setContentsMargins(-1, 0, -1, 0)
        self.horizontalLayout_2.setSpacing(0)
        self.horizontalLayout_2.setObjectName("horizontalLayout_2")
        self.listWidget = QtWidgets.QListWidget(self.frame_3)
        self.listWidget.setObjectName("listWidget")
        self.horizontalLayout_2.addWidget(self.listWidget)
        self.verticalLayout.addWidget(self.frame_3)
        self.frame_2 = QtWidgets.QFrame(widget)
        self.frame_2.setFrameShape(QtWidgets.QFrame.StyledPanel)
        self.frame_2.setFrameShadow(QtWidgets.QFrame.Raised)
        self.frame_2.setObjectName("frame_2")
        self.horizontalLayout_4 = QtWidgets.QHBoxLayout(self.frame_2)
        self.horizontalLayout_4.setContentsMargins(-1, 0, -1, 0)
        self.horizontalLayout_4.setSpacing(0)
        self.horizontalLayout_4.setObjectName("horizontalLayout_4")
        self.lineEdit_info = QtWidgets.QLineEdit(self.frame_2)
        self.lineEdit_info.setMinimumSize(QtCore.QSize(0, 25))
        self.lineEdit_info.setMaximumSize(QtCore.QSize(16777215, 25))
        font = QtGui.QFont()
        font.setPointSize(10)
        self.lineEdit_info.setFont(font)
        self.lineEdit_info.setObjectName("lineEdit_info")
        self.horizontalLayout_4.addWidget(self.lineEdit_info)
        self.verticalLayout.addWidget(self.frame_2)
        self.frame_4 = QtWidgets.QFrame(widget)
        self.frame_4.setFrameShape(QtWidgets.QFrame.StyledPanel)
        self.frame_4.setFrameShadow(QtWidgets.QFrame.Raised)
        self.frame_4.setObjectName("frame_4")
        self.horizontalLayout_3 = QtWidgets.QHBoxLayout(self.frame_4)
        self.horizontalLayout_3.setContentsMargins(-1, 0, -1, 0)
        self.horizontalLayout_3.setObjectName("horizontalLayout_3")
        self.label = QtWidgets.QLabel(self.frame_4)
        self.label.setObjectName("label")
        self.horizontalLayout_3.addWidget(self.label)
        self.lineEdit_path = QtWidgets.QLineEdit(self.frame_4)
        self.lineEdit_path.setEnabled(True)
        self.lineEdit_path.setMinimumSize(QtCore.QSize(0, 25))
        self.lineEdit_path.setMaximumSize(QtCore.QSize(16777215, 25))
        font = QtGui.QFont()
        font.setPointSize(10)
        self.lineEdit_path.setFont(font)
        self.lineEdit_path.setObjectName("lineEdit_path")
        self.horizontalLayout_3.addWidget(self.lineEdit_path)
        self.pushButton_openpath = QtWidgets.QPushButton(self.frame_4)
        self.pushButton_openpath.setMinimumSize(QtCore.QSize(0, 25))
        self.pushButton_openpath.setStyleSheet("QPushButton {\n"
"    background-color: rgb(203, 203, 203);\n"
"}\n"
"QPushButton:hover {\n"
"    background-color: rgb(152, 152, 152);\n"
"}\n"
"QPushButton:pressed {\n"
"    background-color: rgb(118, 118, 118);\n"
"}")
        self.pushButton_openpath.setObjectName("pushButton_openpath")
        self.horizontalLayout_3.addWidget(self.pushButton_openpath)
        self.pushButton_modifypath = QtWidgets.QPushButton(self.frame_4)
        self.pushButton_modifypath.setMinimumSize(QtCore.QSize(0, 25))
        self.pushButton_modifypath.setStyleSheet("QPushButton {\n"
"    background-color: rgb(203, 203, 203);\n"
"}\n"
"QPushButton:hover {\n"
"    background-color: rgb(152, 152, 152);\n"
"}\n"
"QPushButton:pressed {\n"
"    background-color: rgb(118, 118, 118);\n"
"}")
        self.pushButton_modifypath.setObjectName("pushButton_modifypath")
        self.horizontalLayout_3.addWidget(self.pushButton_modifypath)
        self.verticalLayout.addWidget(self.frame_4)
        self.verticalLayout.setStretch(0, 1)
        self.verticalLayout.setStretch(1, 6)
        self.verticalLayout.setStretch(2, 1)
        self.verticalLayout.setStretch(3, 1)

        self.retranslateUi(widget)
        QtCore.QMetaObject.connectSlotsByName(widget)

    def retranslateUi(self, widget):
        _translate = QtCore.QCoreApplication.translate
        widget.setWindowTitle(_translate("widget", "酷狗音乐下载器"))
        self.lineEdit_search.setPlaceholderText(_translate("widget", "搜索单曲、歌手"))
        self.pushButton_search.setText(_translate("widget", "搜索"))
        self.pushButton_clear.setText(_translate("widget", "清空"))
        self.label.setText(_translate("widget", "文件保存至："))
        self.pushButton_openpath.setText(_translate("widget", "打开文件夹"))
        self.pushButton_modifypath.setText(_translate("widget", "修改路径"))
