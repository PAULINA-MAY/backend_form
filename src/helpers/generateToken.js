const jwt = require('jsonwebtoken')
import config from '../config'

const tokenSing = async (results) =>{
    return jwt.sign(
         {
            _id: results.Id_user,
            _rol : results.rol.Name_rol,
            _email : results. Email_user,
            _nombres : results.FirstNames_user,
            _apellidos : results.LastNames_user,
            _img : results.ImgProfile_user,
         },
         config.jwt_secret ,
         {
            expiresIn: "5h"
         } 
    );
};

const verifyToken = async ( token)  =>{
    try {
 
       return jwt.verify(token, config.jwt_secret ) 
    } catch (error) {
      
       return null;
       
    }
    
 }
 
 
 
 module.exports = {tokenSing, verifyToken }