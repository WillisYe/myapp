// deno run -A setIp.js
// 寻找能够正常使用的IP地址，需要以管理员身份运行命令行
async function main() {
  var prefix = '192.168.20.'
  var arr = [...new Array(255)]
  for (const index of Object.keys(arr).slice(20)) {
    var ipAddress = prefix + index
    const process = Deno.run({
      cmd: `netsh interface ipv4 set address name="以太网" static ${ipAddress} 255.255.255.0 192.168.20.1`.split(' '),
      stdout: "piped",
      stderr: "piped",
    });

    const { code } = await process.status();
    if (code === 0) {
      console.log('set 0', ipAddress)
      const process = Deno.run({
        cmd: ["ping", 'www.baidu.com'],
        stdout: "piped",
        stderr: "piped",
      });

      const { code } = await process.status();
      if (code === 0) {
        console.log('ping 0', ipAddress)
        return
      } else {
        console.log('ping 1', ipAddress)
      }
    } else {
      console.log('set 1', ipAddress)
    }
  }
}

main()

/* 
在Windows操作系统上，可以使用以下命令来设置IP地址：
netsh interface ip set address "<接口名称>" static <IP地址> <子网掩码> [<默认网关>]
其中，<接口名称>是网络适配器的名称，可以通过运行ipconfig命令查看。<IP地址>是所需设置的IP地址，<子网掩码>是子网掩码。可选项<默认网关>是默认网关的IP地址，可以省略。

例如，要将本机的IP地址设置为192.168.1.100，子网掩码为255.255.255.0，没有默认网关：
netsh interface ip set address "以太网" static 192.168.1.100 255.255.255.0
*/

/* 
在命令行中设置本机IP地址，需要使用netsh命令。具体步骤如下1：

打开命令提示符（CMD），以管理员身份运行。
输入以下命令，查看网络适配器列表：netsh interface ipv4 show interfaces。
找到要配置的网络适配器的接口索引号（Interface Index）。
输入以下命令，为该网络适配器配置IP地址：netsh interface ipv4 set address name="以太网" static IP地址 子网掩码 网关。
其中，"接口名称"根据上面查找到的接口索引号，换成对应的名称；"IP地址"要设置的IP地址；"子网掩码"要设置的子网掩码；"网关"要设置的默认网关2。
*/

/* 
在命令行中设置IPv4的子网前缀长度，需要使用netsh命令。具体步骤如下：

打开命令提示符（CMD），以管理员身份运行。
输入以下命令，查看网络适配器列表：netsh interface ipv4 show interfaces。
找到要配置的网络适配器的接口索引号（Interface Index）。
输入以下命令，为该网络适配器配置子网前缀长度：netsh interface ipv4 set prefixpolicy prefix=子网前缀长度 num=接口索引号。
其中，"子网前缀长度"是要设置的IPv4子网前缀长度；"接口索引号"根据上面查找到的接口索引号。
*/

/* 
netsh interface ipv4 set address name="以太网" static 192.168.20.110 255.255.255.0 192.168.20.1
netsh interface ipv4 set prefixpolicy prefix=24 name=9
ping www.baidu.com
*/