import os
from tkinter import Tk, filedialog


def get_csv_filenames(folder_path):
    csv_files = []
    for filename in os.listdir(folder_path):
        if filename.endswith(".csv"):
            csv_files.append(filename)
    return csv_files


def main():
    # 弹出文件选择对话框
    root = Tk()
    root.withdraw()
    folder_path = filedialog.askdirectory(title="选择本地文件夹")

    if not folder_path:
        print("未选择文件夹。程序结束。")
        return

    csv_filenames = get_csv_filenames(folder_path)
    print("所有的 .csv 文件名：", csv_filenames)


if __name__ == "__main__":
    main()
