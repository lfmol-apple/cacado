import express from "express";
import jwt from "jsonwebtoken";

function validateJWT(req, res, next){
    const token = req.headers["authorization"]?.replace('Bearer ','');
    const secret = process.env.SECRET;
    jwt.verify(token,secret,(err,userInfo) =>{
        if(err){
            res.status(403).end();
            return;
        }
        //req.userInfo = userInfo;
        next();
    })
}

export default validateJWT;