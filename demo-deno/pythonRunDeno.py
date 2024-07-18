# python pythonRunDeno.py
import subprocess
import time

start_time = time.time()

# 执行任务
# ...

deno_command = ["deno", "run", "script.ts", "123"]

# 创建子进程并执行Deno命令
process = subprocess.Popen(deno_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

# 读取子进程的标准输出和标准错误输出
output_data, error_data = process.communicate()

# 打印标准输出和标准错误输出
print("标准输出：")
print(output_data)
print("标准错误输出：")
print(error_data)


end_time = time.time()
execution_time = end_time - start_time

print("Python 执行时间：", execution_time)