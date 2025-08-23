---
prev: false
next: false
---


# 常见问题疑难解答
::: warning Warning 注意
本页面暂无英文版本，若您无法理解简体中文，可能需要使用浏览器翻译功能。

This page does not have an English version. If you cannot understand Simplified Chinese, you may need to use the browser translation function.
:::

## 目录
- [LightFrame](#lightframe)
- [Vilinko Universe](#vilinko-universe)
- [Vui.parser](#vui-parser)


## LightFrame
::: details 无法启动程序，因为计算机中丢失 MSVCP140.dll
此问题通常是由于缺少 **Microsoft Visual C++ Redistributable** 组件所致。我们为您提供了两种解决方案，若无法解决您的问题，请您尝试在微软社区寻求帮助。

### 方法一：安装最新的 Microsoft Visual C++ Redistributable
**<u>MSVCP140.dll 是 Visual C++ Redistributable for Visual Studio 2015-2022 的组成部分，安装该组件可从根本上解决问题。</u>**

1. 访问 [Microsoft Visual C++ Redistributable for Visual Studio 2015-2022](https://learn.microsoft.com/zh-cn/cpp/windows/latest-supported-vc-redist?view=msvc-170) 页面。
2. 根据您的系统架构（32 位或 64 位）选择对应的版本并下载。对于 64 位操作系统，选择 vc_redist.x64.exe；对于 32 位操作系统，选择 vc_redist.x86.exe。
3. 下载完成后，双击运行安装程序
4. 在用户账户控制对话框中，点击 "是" 授予权限
5. 勾选 "我同意许可条款和条件"，然后点击 "安装"
6. 等待安装完成，然后重启计算机

### 方法二：执行系统文件完整性检查
如果安装组件后问题仍然存在，可使用系统自带工具检查并修复系统文件：

1. 按下 `Win + R` 组合键，打开 "运行" 对话框，输入以下命令，然后按 Enter 键：
```cmd
sfc /scannow
```
2. 系统将开始扫描并修复受损的系统文件，请耐心等待过程完成
3. 扫描结束后，重启计算机

### 常见问题处理
- 若提示 "已安装更高版本"，选择 "修复" 选项而非卸载
- 若安装失败，确保您的 Windows 系统已更新至最新版本
- 若问题持续存在，建议从微软官方网站获取进一步支持
:::

## Vilinko Universe
::: info 系统信息
暂无可用常见问题解答数据
:::
## Vui.parser
::: info 系统信息
暂无可用常见问题解答数据
:::

## 没有找到想要的答案？
您可以查看[支持页面](/support/index.md)获取更多帮助。