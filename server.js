import http from 'http'
import { exec } from 'child_process'
import { Webhooks } from '@octokit/webhooks'
import config from './config'

const webhooks = new Webhooks({
  secret: config.secret
})

webhooks.on("*", ({ id, name, payload }) => {
  console.log(name, "even received")
  exec('rm -rf node_modules && npm install -f',
       { cwd: config.fsPath },
       (error, stdout, stderr) => {
         if (error) {
          console.error(error)
          console.error(stderr)
          return
         }
         console.log(stdout)
         exec(`systemctl restart ${config.serviceName}`,
             (error, stdout, stderr) => {
               console.log(stdout)
               console.error(stderr)
               if (error) {
                console.error(error)
               }
         })

  })
})

http.createServer(webhooks.middleware).listen(config.port)
