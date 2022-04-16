import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";




const registrar = async(req,res)=>{
    // evitar registros duplicados
    const { email } = req.body;
    const existeUsuario = await Usuario.findOne(({email}));


    if(existeUsuario){
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({msg: error.message})
    }


    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        const usuarioAlmacenado = await usuario.save();
        res.json(usuarioAlmacenado);
    } catch (error) {
       console.log(error) 
    }
     
}

const autenticar = async (req, res)=>{

    const {email, password} = req.body;



    //comprobanr si elusuario existe
    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error("El usuario no existe");
        return res.status(404).json({msg:error.message})
    }
    //comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({msg:error.message})
    }
    //comprobar su password
    if(await usuario.comprobarPassword(password)){
    res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: generarJWT(usuario.id)
    })
    }else{
        const error = new Error("El password es Incorrecto");
        return res.status(403).json({msg:error.message})
    }
}


// confirmar usuario
const confirmar = async (req, res)=>{

 const { token } = req.params;
 const usuarioConfirmar = await Usuario.findOne({token:token});
 if(!usuarioConfirmar){
    const error = new Error("Token no Valido");
        return res.status(403).json({msg:error.message})
 }

 try {
     usuarioConfirmar.confirmado = true;
     usuarioConfirmar.token = "";
     await usuarioConfirmar.save();
     res.json({msg: "Usuario confirmado Correctamente"})
 } catch (error) {
     console.log(error)
 }
 
}

// olvidaron el password
const olvidePassword = async (req, res)=>{
    const { email }= req.body;
    const usuario = await Usuario.findOne({email});
    if(!usuario){
        const error = new Error("El usuario no existe");
        return res.status(404).json({msg:error.message})
    }

    try {
        usuario.token = generarId();
        await usuario.save();
        res.json({msg: "Se ha enviado un correo con las instrucciones"})        
    } catch (error) {
        console.log(error)
    }


};

const comprobarToken = async (req, res) =>{
 const { token } = req.params;
 const tokenValido = await Usuario.findOne({token});
    if(tokenValido){
        // const error = new Error("El usuario no existe");
        // return res.status(404).json({msg:error.message})
        res.json({msg: "Token valido y el usuario existe"})
    }else{
        const error = new Error("Token no Valido");
        return res.status(404).json({msg:error.message});
    }

}

const nuevoPassword = async (req, res) =>{
    const {token} = req.params;
    const {password} = req.body
    const tusuario = await Usuario.findOne({token});
    if(tusuario){
        // const error = new Error("El usuario no existe");
        // return res.status(404).json({msg:error.message})
       // res.json({msg: "Token valido y el usuario existe"})
        tusuario.password = password;
        tusuario.token = "";
        try {
            await tusuario.save();
            res.json({msg:"Password Modificado Correctamente"});
        } catch (error) {
           console.log(error) 
        }
       
    }else{
        const error = new Error("Token no Valido");
        return res.status(404).json({msg:error.message});
    }

}

const perfil = async (req, res)=>{
const { usuario } = req;

res.json(usuario);
}

const adashboar = async (req, resp)=>{

}


export {
   registrar,
   autenticar,
   confirmar,
   olvidePassword,
   comprobarToken,
   nuevoPassword,
   perfil,
   adashboar
}