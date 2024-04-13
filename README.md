Rynkis' FM
========

### Personal FM  

If you wanna specify your personal playlist，you may find out following codes in `pages/api/playlist.ts`：  
`const promises = ['7320208569'].map(id => meting.format(true).playlist(id))`  
and then change the id string in array, it should be netease playlist id.  

To reduce the api response time, now we use [Vercel KV](https://vercel.com/docs/storage/vercel-kv) caching api data. It's available on Hobby and Pro plans, with 256MB of free space available for each user. So if you don't need caching feature, find out following codes in `lib/kvCache.ts`:  
`static noCache: Boolean = false`  
and change `false` to `true`.  

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
