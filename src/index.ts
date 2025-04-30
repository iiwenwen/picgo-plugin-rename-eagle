import path from 'path'

import { IPicGo, IPluginConfig } from 'piclist'

const sleep = async (time: number): Promise<any> => {
  return await new Promise(resolve => setTimeout(resolve, time))
}

const pluginConfig = (ctx: IPicGo): IPluginConfig[] => {
  let userConfig = ctx.getConfig('picgo-plugin-rename-eagle')
  if (!userConfig) {
    userConfig = {}
  }
  return [
    {
      name: 'format',
      type: 'input',
      alias: '路径格式',
      default: (userConfig as IPluginConfig).format || '',
      message: '{localFolder:N:L}',
      required: false
    }
  ]
}

export = (ctx: IPicGo) => {
  const register = (): void => {
    ctx.helper.beforeUploadPlugins.register('rename-eagle', {
      handle: async ctx => {
        const autoRename = ctx.getConfig('settings.autoRename')
        if (autoRename) {
          ctx.emit('notification', {
            title: '❌ 警告',
            body: '请关闭 PicGo 的 【时间戳重命名】 功能,\nrename-eagle 插件重命名方式会被覆盖'
          })
          await sleep(10000)
          throw new Error('rename image conflict with the timestamp renaming of picgo')
        }
        const format: string = ctx.getConfig('picgo-plugin-rename-eagle.format') || ''
        ctx.output = ctx.output.map((item, i) => {
          let fileName = item.fileName
          // 获取即将输出的文件名
          const oldName = ctx.rawInputPath![i]
          if (format) {
            // 去除空格
            fileName = format
              // 截取本地目录
              .replace(/{(localFolder:(\d+)(?::(\d+))?)}/gi, (match, p1, layerStr, substrLenStr) => {
                const dirPath = path.dirname(oldName)
                const paths = dirPath.split(path.sep).filter(p => p !== '' && p !== '.') // 清理无效路径段

                // 参数解析
                const targetLayer = parseInt(layerStr) || 1 // 目标层级（默认1）
                const substrLen = parseInt(substrLenStr) || 0 // 截取长度（0=不截取）

                // 计算安全层级（从后往前数）
                const safeLayer = Math.max(1, Math.min(targetLayer, paths.length))
                const targetIndex = paths.length - safeLayer // 倒数换算为正向索引

                // 获取目标文件夹名
                let folderName = paths[targetIndex] || ''

                // 长度截取逻辑
                if (substrLen > 0) {
                  folderName = folderName.substring(0, substrLen)
                }

                return folderName
              })

            // 最后如果 fileName 只是一个 /，则进行特殊处理，用索引来作为文件名
            if (fileName.slice(-1) === '/') {
              fileName += i.toString()
            }

            fileName += item.extname
          }
          item.fileName = fileName
          return item
        })
      },
      config: pluginConfig
    })
  }
  return {
    register,
    config: pluginConfig
  }
}
