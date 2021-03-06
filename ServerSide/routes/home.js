var express = require('express');
var app = express();
var router = express.Router();
const path = require('path').join(__dirname,'../public');
var log = require('../modules/myModules/Controller/Utente/Utente_log');
var complete_reg = require('../modules/myModules/Controller/Complete_registration/Complete_Reg');
app.use(router);

router.get('/confirm_registration/:token',function(req,res){
    log.Confirm_singup(req.params.token,function(a){
        if(a.code === 0){
            res.writeHead(301, { "Location": "http://" + req.get('host')+ '/public/regCompleted.html' });
            res.end();
        }else{
            res.writeHead(301, { "Location": "http://" + req.get('host') + '/public/tokenExpired.html' });
            res.end();
        }
    });
});

router.get('/autocomplete/artist/:searched',function(req,res){
    if(req.session && req.session.islog === 1){
        if(req.params.searched !== "") {
            complete_reg.search_artista(req.params.searched, function (a) {
                res.status(a.status).end(JSON.stringify(a));
            });
        }else{
            var json = {code:"",status:"",text:""};
            res.status(200).end(JSON.stringify(json));
        }
    }else {
        res.status(200).end(JSON.stringify({code:1}));
    }
});

router.get('/autocomplete/genere/:searched',function(req,res){
    if(req.session && req.session.islog === 1){
        if(req.params.searched !== "") {
            complete_reg.search_genere(req.params.searched,function (a) {
                res.status(a.status).end(JSON.stringify(a));
            });
        }else{
            var json = {code:"",status:"",text:""};
            res.status(200).end(JSON.stringify(json));
        }
    }else {
        res.status(200).end(JSON.stringify({code:1}));
    }
});

router.post('/Complete_Reg',function(req,res){
    complete_reg.complete_reg(req.body,req.session.email,function(a){
        if(a.status === 200) req.session.completed = 1;
        res.status(a.status).end(JSON.stringify(a));
    });
});

router.get('/multiForm',function(req,res){
    if(req.session && req.session.islog === 1){
        res.status(200).end(JSON.stringify({code:2}));
    }else {
        res.status(200).end(JSON.stringify({code:1}));
    }
});

router.get('/login',function(req,res){
   if(req.session && req.session.islog===1){
       if(req.session.completed === 0){
        res.status(200).end(JSON.stringify({code:2}));
       }else{
        res.status(200).end(JSON.stringify({code:3}));
       }
   }else{
    res.status(200).end(JSON.stringify({code:1}));
   }
});

router.get('/webApp',function(req,res){
    if(req.session && req.session.islog === 1){
        res.status(200).end(JSON.stringify({code:3}));
    }else {
       res.status(200).end(JSON.stringify({code:1}));
    }
});

module.exports = router;