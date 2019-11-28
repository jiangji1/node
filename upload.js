const fs = require('fs')
const path = require('path')
const cc = require('ssh2-sftp-client')

let dabao = path.resolve(__dirname, '../../../github/my-blog-web/dabao')

function readAll () {
  const paths = [dabao]
  let res = []
  while (paths.length) {
    const head = paths.shift()
    if (!fs.existsSync(head)) continue
    const f = fs.statSync(head)
    if (!f.isDirectory()) res.push(head)
    const d = fs.readdirSync(head)
    d.forEach(v => {
      const p = path.resolve(head, v)
      if (!fs.existsSync(p)) return
      const f = fs.statSync(p)
      if (!f.isDirectory()) res.push(p)
      else paths.push(p)
    })
  }
  const reg = new RegExp(dabao.replace(/\\/g, '\\\\'), 'g')
  return res.map(v => v.replace(reg, '').replace(/\\/g, '/'))
}
const allFiles = readAll()
console.log(allFiles)

// up.json保存着服务器ip，端口，用户名，密码
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'up.json')))

const c = new cc(config)

async function f () {
  let a
  await c.connect(config)
  a = await Promise.all(allFiles.map(v => c.put(path.resolve(dabao, v.slice(1)), `/usr/share/nginx/web/dabao${v}`) ))
  console.log(a)
  c.end()
}
f()