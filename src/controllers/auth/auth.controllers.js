import { tokenSing } from "../../helpers/generateToken";
import { encrypt, compare} from "../../helpers/handleBcrypt";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
export const blacklist = [];

const registerUser = async (req, res) => {
  try {
      const { firstNames, lastNames, password, email } = req.body;
      const passwordHash = await encrypt(password);
      const defaultImage = 'https://res.cloudinary.com/ddfdcx85l/image/upload/v1708497453/ugbw6xdzxrxhqvzpdtfe.jpg';

      const newUser = await prisma.user.create({
          data: {
              FirstNames_user: firstNames,
              LastNames_user: lastNames,
              Email_user: email,
              Password_user: passwordHash,
              ImgProfile_user: defaultImage,
              rol: { 
                  create: {
                      Name_rol: 'user'
                  }
              }
          },
          include: {
              rol: true  
          }
      });

      if (!newUser) {
          return res.status(401).send({
              message: 'The user or role has not been inserted',
              status: 401
          });
      }

      res.send({
          message: 'User Created',
          status: 200,
          user: newUser  
      });
      
  } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Internal Server Error' });
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { Email_user: email },
      select: {
        Id_user: true,
        Email_user: true,
        FirstNames_user: true,
        LastNames_user: true,
        Password_user   : true,
        ImgProfile_user: true,

        rol: {
          select: { Name_rol: true }, 
        },
      },
    });

    if (!user) {
      return res.status(409).json({
        status: 409,
        message: 'No se encontraron datos para este usuario.',
      });
    }

    const checkPassword = await compare(password, user.Password_user);
    if (!checkPassword) {
      return res.status(409).json({
        status: 409,
        message: 'La contraseña proporcionada es incorrecta.',
      });
    }

    const tokenSession = await tokenSing(user);
    res.cookie('token', tokenSession, { httpOnly: true });

  
    const { Password_user, ...userData } = user;

    return res.status(200).json({
      status: 200,
      message: 'Inicio de sesión exitoso.',
      token: tokenSession,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

  
  

export const methods= {
    registerUser,
    login
  
}