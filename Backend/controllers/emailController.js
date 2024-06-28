
var jwt = require('jsonwebtoken');
const User = require('../models/User.model'); 


const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendRecoveryEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: 3600 // expires in 1 hour
    });
    const recoveryLink = `http://localhost:3000/nuevacontraseña?token=${token}&email=${email}`;

    const msg = {
        to: email,
        from: 'movieverserecovery@gmail.com',
        subject: 'Recuperación de Contraseña - MovieVerse',
        text: `Haz clic en el siguiente enlace para recuperar tu contraseña: ${recoveryLink}`,
    };

    try {
        await sgMail.send(msg);
        console.log('Correo enviado con SendGrid');
        res.status(200).send('Correo de recuperación enviado');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).send(error.toString());
    }
};
