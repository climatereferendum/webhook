import http from 'http'
import { exec } from 'child_process'
import { Webhooks } from '@octokit/webhooks'
import config from './config'

const webhooks = new Webhooks({
  secret: config.secret
})

webhooks.on("*", ({ id, name, payload }) => {
  console.log(name, "even received")
  exec('npm install -f',
       { cwd: config.fsPath },
       (error, stdout, stderr) => {
         console.log(stdout)
         console.error(stderr)

  })
  exec(`systemctl restart ${config.serviceName}`,
       (error, stdout, stderr) => {
         console.log(stdout)
         console.error(stderr)
  })
})

http.createServer(webhooks.middleware).listen(config.port)
