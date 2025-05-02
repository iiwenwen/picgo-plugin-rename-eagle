## picgo-plugin-reanme-eagle

使用文件夹目录作为文件名重命名图片。

该插件主要配合eagle上传图片，用eagle图片的上级目录作为图片名。

注意：本插件只适配piclist。
## 配置规则

### 配置格式{localFolder:N:L}

使用指定层级的目录与指定文件长度来作为文件名（从倒数开始为层级1）。

{localFolder:N:L} 示例：
- N=2 → 取倒数第2层目录
- L=3 → 截取前3个字符

配置为{localFolder:2}上传文件名为 `/images/test/localImage.jpg` 重命名为`images.jpg` 

配置为{localFolder:2:3}上传文件名为 `/images/test/localImage.jpg` 重命名为`im.jpg` 

避免与其他重命名插件冲突，请尽量使用单独配置。

### 目标目录

目标目录为空时，所有文件使用配置格式修改文件名。

目标目录不为空时，只修改目标目录中的文件。使用`，`输入多个目录。

## ChangeLog
- 250430 创建
- 250502 增加目标目录功能

