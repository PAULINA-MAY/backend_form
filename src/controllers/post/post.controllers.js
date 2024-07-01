const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const addform = async (req, res) => {
    try {
         const id = parseInt(req.params.id);
      const {title, desc } = req.body;
      if (!id || !title || !desc) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }
        const isUserExist = await prisma.user.findUnique({
            where : {
                Id_user: id,
            }
        })

        if(!isUserExist){
           return res.status(404).json({ message: 'User not found' });
        }

      const newForm = await prisma.form.create({
        data: {
          FK_Id_user :  id,
          Title_f  : title,
          Desc_p : desc,
        },
      });
  
      res.status(201).json(newForm);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  };

  const addQuestion = async (req, res) =>{
    try {
        const id = parseInt(req.params.id);
        const {content , value} = req.body;
        if (!id || !content || !value) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
          }
        const newQuestion = await prisma.question.create({
           data  :{
             
            FK_Id_f : id,
            Content_q : content,
            Value_q : value
           }

        });
        res.status(201).json(newQuestion)
    } catch (e) {
        console.log(e)
        res.status(500).json("Internal Server Error")
        
    }

  }
 const addOption = async (req,res) =>{
     try {
     const id = parseInt(req.params.id);
     const {content, isCorrect} = req.body;
     if (!id || !content || !isCorrect === undefined) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }
      const isCorrectBool = Boolean(isCorrect);

       const newOption = await prisma.option.create({
        data : {
            FK_Id_q : id,
            Content_o : content,
            IsCorrect : isCorrectBool 
        }
       });
        res.status(201).json(newOption)
     } catch (e) {
        console.log(e);
        res.status(500).json("Internal Server Error");
        
     }
 }

const addAnswer = async( req, res) => {
    try {
        const {id_q, id_u,id_o} = req.body;
        if (!id_q|| !id_u || !id_o ) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
          }
       const addAnswer = await prisma.answer.create({
         data : {
            FK_Id_q : id_q,
            FK_Id_u : id_u,
            FK_Id_o : id_o
         }
       });

        res.status(201).json(addAnswer)
    } catch (e) {
        console.log(e);
        res.status(500).jsdon("Internal Server Error")
    }
}
  export const postMethods= {
    addform ,
    addQuestion,
    addOption,
    addAnswer
 
  
}