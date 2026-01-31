#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
XLSX转JSON脚本（简化版）- Python版本
用法: python xlsx2json_simple.py <输入文件路径> [输出文件路径]

说明：此版本使用基础的文本处理方法，处理CSV格式文件
无需额外依赖包，适用于简单的表格数据转换
"""

import sys
import json
import os
import csv
from pathlib import Path


def show_usage():
    print("用法:")
    print("  python xlsx2json_simple.py <输入文件路径> [输出文件路径]")
    print("")
    print("支持的文件格式:")
    print("  - .csv (推荐)")
    print("  - .txt (制表符或逗号分隔)")
    print("")
    print("参数:")
    print("  输入文件路径    - 要转换的CSV/TXT文件路径")
    print("  输出文件路径    - 生成的JSON文件路径（可选，默认与输入文件同名但扩展名为.json）")
    print("")
    print("示例:")
    print("  python xlsx2json_simple.py data.csv")
    print("  python xlsx2json_simple.py data.csv output.json")
    print("")
    print("注意:")
    print("  如果您有.xlsx文件，请先在Excel中另存为CSV格式")


def validate_file(file_path):
    """验证输入文件"""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"文件不存在: {file_path}")

    if not os.path.isfile(file_path):
        raise ValueError(f"{file_path} 不是一个文件")

    ext = Path(file_path).suffix.lower()
    valid_extensions = ['.csv', '.txt']

    if ext not in valid_extensions:
        raise ValueError(f"{file_path} 不是支持的文件格式（需要.csv或.txt）")

    return True


def generate_output_path(input_path):
    """生成输出文件路径"""
    path = Path(input_path)
    return str(path.with_suffix('.json'))


def detect_delimiter(line):
    """检测分隔符"""
    delimiters = [',', '\t', ';', '|']
    counts = []

    for delimiter in delimiters:
        count = line.count(delimiter)
        counts.append((delimiter, count))

    # 选择出现次数最多的分隔符
    best = max(counts, key=lambda x: x[1])
    return best[0]


def convert_to_json(input_path, output_path):
    """转换CSV/TXT文件为JSON"""
    try:
        print(f"正在读取文件: {input_path}")

        # 读取文件内容
        with open(input_path, 'r', encoding='utf-8') as f:
            content = f.read()

        lines = [line.strip() for line in content.split('\n') if line.strip()]

        if not lines:
            raise ValueError("文件为空")

        print(f"找到 {len(lines)} 行数据")

        # 检测分隔符
        delimiter = detect_delimiter(lines[0])
        delimiter_name = '\\t' if delimiter == '\t' else delimiter
        print(f"检测到分隔符: \"{delimiter_name}\"")

        # 转换为key-value对象
        result = {}
        processed_rows = 0

        for i, line in enumerate(lines, 1):
            if not line:
                continue

            # 使用CSV模块处理复杂的分隔情况
            try:
                if delimiter == ',':
                    reader = csv.reader([line])
                    fields = next(reader)
                else:
                    fields = line.split(delimiter)

                if len(fields) < 2:
                    print(f"跳过第 {i} 行：字段不足")
                    continue

                key = fields[0].strip()
                value = fields[1].strip()

                # 跳过key为空的行
                if not key:
                    print(f"跳过第 {i} 行：key为空")
                    continue

                # 移除引号
                key = key.strip('"\'')
                value = value.strip('"\'')

                result[key] = value
                processed_rows += 1

            except Exception as e:
                print(f"跳过第 {i} 行：解析错误 - {e}")
                continue

        print(f"已处理 {processed_rows} 行数据")

        if processed_rows == 0:
            print("警告: 没有找到有效的数据行")

        # 写入JSON文件
        print(f"正在写入文件: {output_path}")
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)

        print("✅ 转换完成！")
        print(f"   输入文件: {input_path}")
        print(f"   输出文件: {output_path}")
        print(f"   转换行数: {processed_rows}")

    except Exception as error:
        print(f"❌ 转换失败: {error}")
        sys.exit(1)


def main():
    """主函数"""
    args = sys.argv[1:]

    if len(args) == 0 or '-h' in args or '--help' in args:
        show_usage()
        return

    if len(args) < 1 or len(args) > 2:
        print("❌ 参数数量错误")
        show_usage()
        sys.exit(1)

    input_path = args[0]
    output_path = args[1] if len(args) > 1 else generate_output_path(input_path)

    try:
        # 验证输入文件
        validate_file(input_path)

        # 执行转换
        convert_to_json(input_path, output_path)

    except Exception as error:
        print(f"❌ {error}")
        sys.exit(1)


if __name__ == "__main__":
    main()