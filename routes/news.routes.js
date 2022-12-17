const router = require("express").Router()
const News = require("../models/News.model")
const uploadImg = require("../config/cloudinary")
const isLoggedIn = require("../middleware/isLoggedIn") // me va ayudar pasaber si tengo una session
router.get("/addNews",isLoggedIn, (req,res,next)=>{
    const user = req.session.currentUser
    res.render("news/formNews",{ user })//monstar archivo
})                  
//tenemos que validar si el usuario esta loggeado
//nombre donde las imgs estan alamacenadas
router.post("/addNews", uploadImg.array("images",3) ,async( req, res,next)=>{
    const {images,action, ...restBody } = req.body
    const  {_id} = req.session.currentUser
    /**
     *  restBody = { content:"....."}
     */
    try{
        if(req.files.length){
            //estoy creando una llave nueva en el obj restBody
            restBody.images = req.files.map(item => item.path )
        }
        //por el momento para ver si la data se manda
        const newNews= await  News.create({...restBody,_owner:_id})
        console.log("todo bien",newNews)
        //mandar a rutas redirect
        res.redirect("/")
    }catch(error){
        console.log("error:",error)
        res.json({msg:"todo mal "})
    }
})






module.exports = router