async function getDataFromLink(Mlink)  {

  const p = require('puppeteer');
  var fs = require('fs');
  //const imageDownloader = require('node-image-downloader')
  //create a file named mynewfile1.txt:
  
  var final=[];
  //let Mlink='https://www.amazon.com/b/ref=dp_bc_aui_C_3?ie=UTF8&node=17369013011';

  let browser=await p.launch();

  let page=await browser.newPage();
  await page.goto(Mlink,{waitUntil: 'networkidle2'});
  //var ans;
 

let data=await page.evaluate(()=>{
  
      var nextLinks=document.getElementsByClassName('a-link-normal a-text-normal');
      var names=document.getElementsByClassName('a-size-base-plus a-color-base a-text-normal');
      var v=document.getElementsByClassName('a-row a-size-small');
      //console.log(names[1].innerText);
      //console.log(v);
      var out=[];
      for(let i=0;i<names.length;i++)
      {
          let val={
              "nextLink":nextLinks[i].href ,
              "text": names[i].innerText,
              "clearImageLink":"",
              "Rating":v[i].innerText,
              "id":(i+1).toString()
          }
          out.push(val);
      }
      return out;
  })
  
  console.log(data);
  console.log("123")
  
  //await browser.close();
  for(let i=0;i<data.length;i++)
  {
      let sublink=data[i].nextLink;
     
     
  
      await page.goto(sublink,{
        waitUntil: 'networkidle2'
    });

      let clearImageLink =await page.evaluate(()=>{
          let ans=document.getElementById('imgTagWrapperId');
          let val=ans.getElementsByTagName('img');
          let v=val.landingImage;
          let e=v.dataset;
          clearImageLink=e.oldHires;
          return clearImageLink;
      })
      data[i].clearImageLink=clearImageLink;
  
  



  const imageDownloader = require('node-image-downloader')

  imageDownloader({
    imgs: [
      {
        uri: data[i].clearImageLink,
        filename: (i+1).toString()
      }
      
    ],
    dest: './images', //destination folder
  })
    .then((info) => {
      console.log('all done', info)
    })
    .catch((error, response, body) => {
      console.log('something goes bad!')
      console.log(error)
    })
   
}



  debugger;
  await browser.close();
  console.log(data);
  final=data;
  //console.log("hello");
  return final;
};


async function getDataFromCategory(category,subcategory)  {
  
  
  const p = require('puppeteer');
  var fs = require('fs');
  //const imageDownloader = require('node-image-downloader')
  //create a file named mynewfile1.txt:
  
  var final=[];
  let Glink='https://www.amazon.com/grocery-breakfast-foods-snacks-organic/b/?ie=UTF8&node=16310101&ref_=topnav_storetab_grocery_sn_fo';

  let browser=await p.launch();

  let page=await browser.newPage();
  await page.goto(Glink,{waitUntil: 'networkidle2'});
  
  const catlink=await page.evaluate(function(category){
    
     
     var wrapper=document.getElementById('nav-subnav');
     var cat=wrapper.getElementsByClassName('nav-a');
     
     let out='';
     
     for(let i=0;i<cat.length;i++)
     {  out = out + cat[i].outerText
         const f = category.localeCompare(cat[i].outerText)
         
         if(f===0)
          { 
              return cat[i].href
          }
     }
    return -1;

  },category)
  

  await page.goto(catlink,{waitUntil: 'networkidle2'});

  let sublink=await page.evaluate(function(subcategory){
     var subcat=document.getElementsByClassName('a-link-normal octopus-pc-category-card-v2-category-link');
     let out;
      for(let i=0;i<subcat.length;i++)
      {
          if(subcat[i].title===subcategory)
          {
              out=subcat[i].href;
              return out;
          }
      }
   
    

   },subcategory)
   const LastOut = await getDataFromLink(sublink)
   return LastOut

};






getDataFromCategory("Breakfast","Cereals").then((a)=>{
  console.log(a)
}).catch((e)=>{
  console.log(e)
});
