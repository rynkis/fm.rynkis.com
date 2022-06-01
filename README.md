Rynkis' FM
========

### Personal FM  

If you wanna specify your personal playlist，you may find out following codes in `pages/api/playlist.ts`：  
`const promises = ['7320208569'].map(id => meting.format(true).playlist(id))`  
And then change the id in array, it should be netease playlist id.  

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
Rewrite project with Next.js.  
Use Webpack to pack all front-end resources.  
Rewrite player with jQuery + ES6.  
Rewrite API with Ruby and use Sinatra Server.  
