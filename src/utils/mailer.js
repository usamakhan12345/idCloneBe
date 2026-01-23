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

export const sendResumeEmail = async ({
  to,                 // job creator email
  applicantName,      // applicant name
  job                 // job object
}) => {
    console.log({to})
  const mailOptions = {
    from: 'Career Nest <no-reply@careernest.com>',
    to,
    subject: `New Job Application – ${job?.jobTitle}`,
    html: `
      <h3>New Job Application Received</h3>

      <p><b>${applicantName}</b> has applied for the following job:</p>

      <ul>
        <li><b>Job Title:</b> ${job?.jobTitle}</li>
        <li><b>Location:</b> ${job?.location}</li>
        <li><b>Job Type:</b> ${job?.jobType}</li>
        <li><b>Salary Range:</b> ${job?.salaryRange}</li>
      </ul>

      <p><b>Job Description:</b></p>
      <p>${job?.jobDescription}</p>

      <p>The applicant’s resume is attached with this email.</p>

      <br/>
      <p>Regards,<br/>
      <b>Career Nest Team</b></p>
    `,
    attachments: [
      {
        filename: `${applicantName.replace(/\s+/g, '_')}_Resume.pdf`,
        path: job?.resumeUrl // Cloudinary resume URL
      }
    ]
  };


  

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Resume email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending resume email:', error);
    return false;
  }
};

