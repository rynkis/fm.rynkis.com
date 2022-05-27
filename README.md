Rynkis' FM
========

### 私人电台  

如果您想更换歌单的话，请到 pages/api/playlist.ts 里找到：  
`const promises = ['7320208569'].map(id => meting.format(true).playlist(id))`  
将里面的数字改成您想播放的歌单的 id（当然，是 netease 的）。  

### Usage  

```
git clone https://github.com/Shy07/fm.rynkis.com.git
cd fm.rynkis.com
yarn install
yarn dev
```
Then open http://localhost:3000 in your web browser and enjoy!  

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Update log  
Rewrite project with nextjs.
Use Webpack to pack all front-end resources.  
Rewrite player with jQuery + ES6.  
Rewrite API with Ruby and use Sinatra Server.  
