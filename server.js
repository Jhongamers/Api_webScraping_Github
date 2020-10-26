const express   = require('express')
const puppeteer = require('puppeteer')
const fs        = require('fs')
const cors      = require('cors')
const app       = express()
const jso       = []

/*start is a function used for start in code the user insert the name of user and
name of repository example the repository link is http://github.com/Jhongamers/note
       the user use link api http://localhost/Jhongamers/note
       only /Jhongamers/note  in api you wait 1 minute for scraping ,when you loading page ,all data in page
*/
async function start(user,repository){
    ///this is function get name of files for display in screen 
  async function getNameFiles(page,selector){
       const filesnames = await page.$$eval(selector, links => links.map(link =>link.innerText))
      
         return filesnames
       
     }    
   /*   this is function is used for to pick up the numbers of lines of files and bit of files and name of files
        for to work with this info
*/
     async function getInfoLinesBit(page){
   
        
            const infoLinesFile = await getNameFiles(page,'div.text-mono.f6.flex-auto.pr-3.flex-order-2.flex-md-order-1.mt-2.mt-md-0')
            const infoBitFile = await getNameFiles(page,'.final-path')
            
            return 'files '+infoLinesFile+' '+infoBitFile  

        
      
      
    }
      /*
            --------clickInPageCurrent-----------
      this function is second function that we code read ,
       when start code this is function capture target in page start of github
        the user
       */
   async function clickInPageCurrent(page,selector){
    const typefileother = await page.$$eval(selector,linksm => linksm.map(link =>link.href))
     
          await page.goto(typefileother[0])   //goto is function where is used for redirect the user for first 
      }
     
/*   -----------LanguageCategory--------------
        this is function is responsible for click in all cateogry in page example https://github.com/Jhongamers/note/search?l=css
        this function click in all category of page of search of github after of click in category this is function 
        this function capture link in page examples index.php , search.php this function click in all elements

*/

   async function LanguageCategory(page,selector){
    const typefileother = await page.$$eval(selector,linksm => linksm.map(link =>link.href))
   
  
 
    for(let i=0;i<typefileother.length;i++){
    
      
      const res = await ListAllLinkRepository(page,'div.f4.text-normal a')
    
      await Clickfiles(page,res)
        await page.goto(typefileother[i+1],{waitUntil:'load'}).catch(() => {console.log('data write in json')})
        
      } 
    
   }
      /*   
              ---------ListAllLinkRepository--------
              is responsible for return all links of all files of after we can click in this files
      */
    
  async function ListAllLinkRepository(page,selector){
    const typefileother = await page.$$eval(selector,linksm => linksm.map(link =>link.href))
      

        return typefileother
    
   
  }

  /*  ----------------------Clickfiles----------------
  this is function is responsible for click in all links listed by function ListAllLinkRepository
  in case this is function is executed at same time that function LanguageCategory
  */
  async function Clickfiles(page,res){
    
      
    for(let j=0;j<res.length;j++){
   
            await page.goto(res[j],{waitUntil: 'load'})
            jso.push(await getInfoLinesBit(page))       
               
    }
  }
    
   const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
   const page = await browser.newPage()
  
  
  await page.goto(`https://github.com/${user}/${repository}`)


  await clickInPageCurrent(page,'.d-inline a')

  page.goForward()
 
  await LanguageCategory(page,'.filter-item')

    fs.writeFile('input.json',JSON.stringify(jso,null,2), function(err) {
      if (err) {
         return console.error(err);
      }
    });
     await browser.close()

           
           } 
           app.get('/',cors(),(req,res) =>{
          res.send('executando cara')             
           } )         
     app.get('/:user/:repository',cors(),(req,res) =>{
        if(!fs.existsSync('input.json')){
        res.send('aguarde um minuto arquivo carregando')
        start(req.params.user,req.params.repository)
        }else{
          var f = fs.readFile('input.json','utf8', function(err,data){
            res.json(JSON.parse(data))
           
            })
        }
    })
    
 

   
    app.listen(process.env.PORT || 3000)