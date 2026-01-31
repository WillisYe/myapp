#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
XLSX转JSON批量处理脚本 - Python版本
用法: python batch_convert.py [目录路径]

此脚本会：
1. 查找指定目录（默认当前目录）中的所有.xlsx文件
2. 显示转换选项给用户选择
3. 执行相应的转换操作
"""

import sys
import os
import subprocess
from pathlib import Path


def find_xlsx_files(directory="."):
    """查找Excel文件"""
    files = []

    try:
        path = Path(directory)
        for file_path in path.iterdir():
            if file_path.is_file() and file_path.suffix.lower() == '.xlsx':
                files.append(file_path.name)
    except Exception as error:
        raise Exception(f"无法读取目录 {directory}: {error}")

    return files


def show_files(files):
    """显示找到的文件"""
    print(f"找到 {len(files)} 个Excel文件:")
    for i, file in enumerate(files, 1):
        print(f"  {i}. {file}")


def generate_output_name(input_file, extension):
    """生成输出文件名"""
    path = Path(input_file)
    return path.stem + extension


def show_convert_options():
    """显示转换选项"""
    print("\n转换选项:")
    print("1. 使用完整版本（需要安装openpyxl依赖包）")
    print("2. 手动转换指南（离线方式）")
    print("3. 退出")


def prompt_user(question):
    """提示用户输入"""
    try:
        return input(question).strip()
    except KeyboardInterrupt:
        print("\n\n程序被用户中断")
        sys.exit(0)


def run_command(command):
    """运行命令"""
    try:
        result = subprocess.run(command, shell=True, check=True,
                               capture_output=True, text=True)
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr


def check_dependencies():
    """检查依赖"""
    try:
        import openpyxl
        return True
    except ImportError:
        return False


def install_dependencies():
    """安装依赖"""
    print("需要安装依赖包，正在执行 pip install openpyxl...")
    success, output = run_command("pip install openpyxl")

    if success:
        print("✅ 依赖安装完成")
        return True
    else:
        print("❌ 依赖安装失败:")
        print(output)
        print("请手动运行: pip install openpyxl")
        return False


def convert_with_python(files):
    """使用Python版本转换"""
    print("\n使用Python版本转换...")

    # 检查依赖
    if not check_dependencies():
        if not install_dependencies():
            return

    for file in files:
        try:
            print(f"\n正在转换: {file}")

            command = f'python xlsx2json.py "{file}"'
            success, output = run_command(command)

            if success:
                print("✅ 转换成功")
                print(output)
            else:
                print("❌ 转换失败:")
                print(output)

        except Exception as error:
            print(f"❌ 转换 {file} 时出错: {error}")


def show_manual_guide(files):
    """显示手动转换指南"""
    print("\n📋 手动转换指南:")
    print("====================")

    for i, file in enumerate(files, 1):
        print(f"\n{i}. 处理文件: {file}")
        print("   步骤:")
        print("   a) 用Excel打开此文件")
        print("   b) 确保A列是key，B列是value")
        print("   c) 选择 文件 > 另存为")
        print(f"   d) 文件名: {generate_output_name(file, '.csv')}")
        print("   e) 文件类型选择: CSV (逗号分隔)(*.csv)")
        print("   f) 点击保存")
        print(f"   g) 运行: python xlsx2json_simple.py \"{generate_output_name(file, '.csv')}\"")

    print("\n或者，您也可以使用在线工具:")
    print("- https://convertio.co/xlsx-csv/")
    print("- https://www.zamzar.com/convert/xlsx-to-csv/")

    print("\n转换为CSV后，使用以下命令:")
    for file in files:
        csv_name = generate_output_name(file, '.csv')
        print(f"python xlsx2json_simple.py \"{csv_name}\"")


def main():
    """主函数"""
    args = sys.argv[1:]
    directory = args[0] if args else "."

    print("XLSX转JSON批量处理工具 - Python版本")
    print("==================================")

    try:
        # 查找Excel文件
        files = find_xlsx_files(directory)

        if not files:
            print(f"在目录 \"{directory}\" 中没有找到.xlsx文件")
            return

        show_files(files)
        show_convert_options()

        choice = prompt_user("\n请选择操作 (1-3): ")

        if choice == '1':
            convert_with_python(files)
        elif choice == '2':
            show_manual_guide(files)
        elif choice == '3':
            print("退出程序")
        else:
            print("无效选择")

    except Exception as error:
        print(f"❌ {error}")
        sys.exit(1)


if __name__ == "__main__":
    main()