const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllForms = async (req, res) => {
    try {
      const forms = await prisma.form.findMany({
        include: {
          Question: false,
        },
      });
  
      const result = await Promise.all(forms.map(async (form) => {
        const questions = await prisma.question.findMany({
          where: {
            FK_Id_f: form.Id_f,
          },
          include: {
            Option: true,
          },
        });
  
        return {
          ...form,
          Questions: questions.map(question => ({
            Id_q: question.Id_q,
            Content_q: question.Content_q,
            Value_q: question.Value_q,
            DateCreate_q: question.DateCreate_q,
            Options: question.Option,
          })),
        };
      }));
  
      res.status(200).json(result);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  };


  const getAllQuestions = async (req, res) => {
    try {
      const formId = parseInt(req.params.formId);
  
      if (!formId) {
        return res.status(400).json({ message: 'Se requiere el ID del formulario' });
      }
  
      const questions = await prisma.question.findMany({
        where: {
          FK_Id_f: formId,
        },
        include: {
          Option: true
/*           Answer: {
            include: {
              User: false,
              Option: true,
            },
          }, */
        },
      });
  
      res.status(200).json({data : questions});
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  };


 
  const getResultsForm = async (req, res) => {
    try {
      const formId = parseInt(req.params.formId);
      const userId = parseInt(req.params.userId);
  
      if (!formId || !userId) {
        return res.status(400).json({ message: 'Inserta todos los campos' });
      }
  
      // Obtener el usuario
      const user = await prisma.user.findUnique({
        where: { Id_user: userId },
        select: {
          FirstNames_user: true,
          LastNames_user: true,
        },
      });
  
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Obtener todas las preguntas del formulario
      const questions = await prisma.question.findMany({
        where: { FK_Id_f: formId },
        select: {
          Id_q: true,
          Value_q: true,
          Content_q: true,
          Option: {
            where: { IsCorrect: true },
            select: { Id_o: true },
          },
        },
      });
  
      // Calcular el total de puntos posibles del formulario
      const totalPoints = questions.reduce((acc, question) => acc + question.Value_q, 0);
  
      // Obtener las respuestas más recientes del usuario para cada pregunta del formulario
      const userAnswers = await prisma.answer.findMany({
        where: {
          FK_Id_q: { in: questions.map(q => q.Id_q) },
          FK_Id_u: userId,
        },
        select: {
          FK_Id_q: true,
          FK_Id_o: true,
          DateCreate_a: true,
        },
        orderBy: {
          DateCreate_a: 'desc'
        }
      });
  
      // Filtrar solo las respuestas más recientes por pregunta
      const latestAnswers = userAnswers.reduce((acc, answer) => {
        if (!acc[answer.FK_Id_q]) {
          acc[answer.FK_Id_q] = answer;
        }
        return acc;
      }, {});
  
      // Calcular los puntos obtenidos por el usuario y clasificar respuestas
      let userPoints = 0;
      const correctAnswers = [];
      const incorrectAnswers = [];
  
      Object.values(latestAnswers).forEach(answer => {
        const question = questions.find(q => q.Id_q === answer.FK_Id_q);
        const isCorrect = question?.Option.some(option => option.Id_o === answer.FK_Id_o);
  
        if (isCorrect) {
          userPoints += question.Value_q;
          correctAnswers.push({
            questionId: question.Id_q,
            questionContent: question.Content_q,
            optionId: answer.FK_Id_o,
          });
        } else {
          incorrectAnswers.push({
            questionId: question.Id_q,
            questionContent: question.Content_q,
            optionId: answer.FK_Id_o,
          });
        }
      });
  
      res.status(200).json({
        userName: `${user.FirstNames_user} ${user.LastNames_user}`,
        totalPoints,
        userPoints,
        correctAnswers,
        incorrectAnswers,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  };
  
   



export const getMethods= {
    getAllForms,
    getAllQuestions,
    getResultsForm 
  
  
}