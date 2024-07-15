Rynkis' FM
========

### 个性化部署  

测试或部署前请根据运行环境新建 `.env` 文件，可指定音乐运营商、个人播放列表及是否启用 api 缓存（因为 Vercel 服务器在国外访问国内音乐运营商存在延迟，建议开启；国内测试或部则署无需开启）。

### Usage  

```
git clone https://github.com/Shy07/fm.rynkis.com.git
cd fm.rynkis.com
yarn install
yarn dev
```
Then open http://localhost:3000 in your web browser and enjoy!  

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Update log  
Cache netease api data with Vercel KV.  
Rewrite project with Next.js.  
Pack all front-end resources with webpack.  
Rewrite player with jQuery + ES6.  
Rewrite API with Ruby and use Sinatra Server.  
