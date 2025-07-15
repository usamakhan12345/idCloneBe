import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shehzadausamakhan@gmail.com',
        pass: 'tpqc yknl ifjb bfur' // NOT your regular Gmail password
    }
});

export const sendOtpEmail = async (to, otp) => {
    const mailOptions = {
        from: 'Carrer Nest Application Otp Code',
        to,
        subject: 'Your OTP Code',
        html: `<p>Your OTP code is <b>${otp}</b>. It is valid for 10 minutes.</p>`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return true;
    } catch (err) {
        console.error('Error sending email:', err);
        return false;
    }
};
