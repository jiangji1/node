const fs = require('fs')
const path = require('path')
const ftp = require('ftp')

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
  return res
}
const allFiles = readAll()
// console.log(allFiles)

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'up.json')))

const c = new ftp()
c.on('ready', function () {
  console.log(2)
  c.list(function (e, list) {
    console.log(1)
    if (e) throw e
    console.dir(list)
    c.end()
  })
})
c.connect(config)
