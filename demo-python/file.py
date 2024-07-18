import os
from tkinter import Tk, filedialog


def get_py_filenames(folder_path):
    py_files = []
    for filename in os.listdir(folder_path):
        if filename.endswith(".py"):
            py_files.append(filename)
    return py_files


def main():
    # 弹出文件选择对话框
    root = Tk()
    root.withdraw()
    folder_path = filedialog.askdirectory(title="选择本地文件夹")

    if not folder_path:
        print("未选择文件夹。程序结束。")
        return

    py_filenames = get_py_filenames(folder_path)
    print("所有的 .py 文件名：", py_filenames)


if __name__ == "__main__":
    main()
