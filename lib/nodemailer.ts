const nodemailer = require('nodemailer');
//import { Transporter } from 'nodemailer';
//Need to include MailboxValidator API to pre-validate email addresses before sending mail

const carrierForm = {
    user: process.env.EMAIL_FROM as string,
    pass: process.env.EMAIL_PASS as string
}

type Carrier = ReturnType<typeof nodemailer.createTransport>;

export const validateMailbox = async (email: string) => {
    try{
        const validationResponse = await fetch(`https://api.mailboxvalidator.com/v2/validation/single?email=${email}&key=${process.env.VALID_MAIL_KEY}&format=json`);
        return {emailValidity: validationResponse.status, hasError: false, error: "No error"};
    } catch (error) {
        console.log('Email validation error: ', error);
        return {emailValidity: false, hasError: true, error: error};
    }
}

export const makeCarrier = () => {
    //Connect to email account
    const carrier = nodemailer.createTransport({
        service: 'gmail',
        auth: carrierForm
    });
    return carrier;
}

export const sendVerificationEmail = async (carrier: Carrier, email: string, vToken: string) => {
    //Email should be pre-validated by this point
    //If email invalid: return & tell user to provide a new, real email address
    //If email valid:
    const timestamp: number = Date.now();
    const verifyOptions = {
        from: process.env.EMAIL_FROM as string,
        to: email,
        subject: 'Account Verification',
        text: `Please verify your email by clicking this link: http://localhost:3000/verifyAccount?token=${vToken}`,
        //Add dsn service to check gmail for bounced deliveries (not reliable, but may weed out some more errors)
        dsn: {
            id: 'verify' + email + timestamp as string,// Make a unique ID for tracking this email.
            return: 'headers', // Request only the headers in the notification.
            notify: ['failure', 'delay'], // Notify on failure and delay.
            recipient: process.env.EMAIL_FROM // Where to send the DSN notification.
        }
    };
    try {
        await carrier.sendMail(verifyOptions);
        console.log("Successfully sent the verification email!");
        return true;
    } catch (error) {
        console.log('Error sending verification email: ', error);
        return false;
    }
}