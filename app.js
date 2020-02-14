const query = require('querystring')
const url = require('url')
const http = require('http')

function run() {
  function process(req, res) {
    // console.log(query.parse(req.url))
    const pathname = url.parse(req.url).pathname
    let str = ''

    if (pathname === '/') {
      res.writeHead(200, {
        'content-type': 'text/html; charset=utf-8'
      })
      str = '<h1>您好</h1><a href="/login">登录</a><br/><a href="/register">注册</a>'
      res.write(str)
      res.end()
    }
    if (pathname === '/login') {
      res.writeHead(200, {
        'content-type': 'text/html; charset=utf-8'
      })
      str = `<form action="/checklogin" method="post">
              <p><label>名字</label><input type="text" name="name"/></p>
              <p><label>密码</label><input type="password" name="password"/></p>
              <input type="submit" value="提交"/>
              </form>`
      res.write(str)
      res.end()
    }
    if (pathname === '/checklogin') {
      req.addListener('data', function (data) {
        const q = query.parse(decodeURIComponent(data))
        let name = q.name
        let password = q.password
        const msql = require('./mysql')
        let sql = 'SELECT * FROM t_user WHERE name="' + name + '" and password="' + password + '"'
        // console.log(msql)
        msql.query(sql, function (row) {
          let str = `<table border="1">`
          str += `<tr>`
          for (const key in row[0]) {
            if (row[0].hasOwnProperty(key)) {
              str += `<th>${key}</th>`
            }
          }
          str += `<th>修改资料</th></tr>`
          row.forEach(item => {
            str += `<tr>`
            for (const key in item) {
              if (item.hasOwnProperty(key)) {
                str += `<th>${item[key]}</th>`
              }
            }
            str += `<th><a href="/modify">修改</a></th></tr>`
          })
          res.writeHead(200, {
            'content-type': 'text/html; charset=utf-8'
          })
          res.write(str)
          res.end()
        })
      })
    }

    if (pathname === '/register') {
      res.writeHead(200, {
        'content-type': 'text/html; charset=utf-8'
      })
      let str = `<form action="/checkregister" method="post">
              <p><label>名字</label><input type="text" name="name"/></p>
              <p><label>密码</label><input type="password" name="password"/></p>
              <p><label>年龄</label><input type="number" name="age"/></p>
              <select name="sex">
                <option name="男" value="1">男</option>
                <option name="女" value="0">女</option>
              </select>
              <p><label>电话</label><input type="text" name="tel" maxlength="11"/></p>
              <input type="submit" value="提交"/>
              </form>`
      res.write(str)
      res.end()
    }

    if (pathname === '/checkregister') {
      req.addListener('data', function (formData) {
        const q = query.parse(decodeURIComponent(formData))
        // console.log(q)
        let name = q.name
        let password = q.password
        let age = q.age
        let tel = q.tel
        let sex = q.sex === 1 ? '男' : '女'
        const mysql = require('./mysql')

        let sql = "SELECT EXISTS(SELECT 1 FROM t_user WHERE name ='" + name + "')"
        mysql.query(sql, function (row) {
          row.forEach(item => {
            for (const key in item) {
              if (item.hasOwnProperty(key)) {
                // console.log(item)
                if (item[key] === 1) {
                  res.writeHead(200, {
                    'content-type': 'text/html; charset=utf-8'
                  })
                  res.write('<h1>注册失败，已有同名用户</h1><a href="/register">返回注册页面</a>')
                  res.end()
                } else {
                  let sql = 'INSERT INTO t_user SET name="' + name + '", password ="' + password + '", nickname="用户", age="' + age + '", sex="' + sex + '", tel="' + tel + '"'
                  // console.log(sql)
                  mysql.query(sql, function (row) {
                    if (row['affectedRows'] === 1) {
                      res.writeHead(200, {
                        'content-type': 'text/html; charset=utf-8'
                      })
                      res.write('<h1>注册成功，请登录</h1><a href="/login">返回登陆页面</a>')
                      res.end()
                    }
                  })
                }
              }
            }
          })
        })
      })
    }
  }

  http.createServer(process).listen(8888)
  console.log('server is listening at 8888')
}

run()
