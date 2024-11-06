import nodemailer from 'nodemailer' 

type EMAIL = {
  email: string,
  nombre: string,
  asunto: string,
  mensaje: string  // Mensaje en formato HTML
}

const emailRegistro = async (datos : EMAIL) => {
    const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "juanpabloqb1990@gmail.com",
          pass: process.env.EMAIL_PASSWORD
        }
      });

      const { email, nombre, asunto, mensaje } = datos
      
      // Enviar el email
      const info = await transport.sendMail({
        from: "juanpabloqb1990@gmail.com",
        to: "juanpqb_19@hotmail.com",
        subject: asunto,
        html: `
          <h2>Enviado por: </h2> 
          <h3>Nombre: </h3> ${nombre}
          <h3>Email: </h3>${email}
          <h3>Mensaje: </h3>
          <p>${mensaje}</p>
        ` 
      })
      
      return info.accepted[0];
}

export default emailRegistro