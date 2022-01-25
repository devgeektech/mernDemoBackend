/** @format */

import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const AvailiableTemplates = {
  RESET_PASSWORD: 'ResetPassword',
  FORGET_PASSWORD: 'ForgetPassword',
  CALIBRATION: 'Calibration',
  MATERIAL_REQUEST:'MaterialRequest',
  MATERIAL_REQUEST_ADMIN:'MaterialRequestAdmin',
};

class Email {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.MAIL_DRIVER,
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    this.body = '';
    this.subject = '';
    this.to = [];
    this.cc = '';
    this.attachments = [];
    this.webURL = process.env.SITE_URL;
    this.adminURL = '';
  }

  async setTemplate(templateName, replaceObject = {}) {
    /* switch (templateName) {
      case AvailiableTemplates.RESET_PASSWORD:
        this.subject = 'Setup your account';
      case AvailiableTemplates.FORGET_PASSWORD:
        this.subject = 'Forget password';
      default:
        break;
    } */
    if (templateName == AvailiableTemplates.RESET_PASSWORD) {
      this.subject = 'Setup your account';
    } else if (templateName == AvailiableTemplates.FORGET_PASSWORD) {
      this.subject = 'Forget password';
    } else if(templateName == AvailiableTemplates.CALIBRATION){
      this.subject = 'Tool Calibration';
    }else if(templateName == AvailiableTemplates.MATERIAL_REQUEST){
      this.subject = 'Material Request Accepted';
    }
    else if(templateName == AvailiableTemplates.MATERIAL_REQUEST_ADMIN){
      this.subject = 'Material Request';
    }
    else {
      this.subject = 'Setup your account';
    }

    let header = fs.readFileSync(
      path.join(__dirname, '..', `emailtemplates`, `Header.html`),
      'utf8'
    );

    let footer = fs.readFileSync(
      path.join(__dirname, '..', `emailtemplates`, `Footer.html`),
      'utf8'
    );

    let content = `${header}${fs.readFileSync(
      path.join(__dirname, '..', `emailtemplates`, `${templateName}.html`),
      'utf8'
    )}${footer}`;

    replaceObject = {
      ...replaceObject,
      webURL: this.webURL,
      adminURL: this.adminURL,
    };
    for (const key in replaceObject) {
      if (replaceObject.hasOwnProperty(key)) {
        const val = replaceObject[key];
        if (typeof val === 'object') {
          for (const k in val) {
            if (val.hasOwnProperty(k)) {
              const v = val[k];
              content = content.replace(new RegExp(`{${key}.${k}}`, 'g'), v);
            }
          }
        } else {
          content = content.replace(new RegExp(`{${key}}`, 'g'), val);
        }
      }
    }
    this.body = content;
    return content;
  }

  setSubject(subject) {
    this.subject = subject;
  }
  setBody(body, replaceObject = {}, lang = 'en') {
    for (const key in replaceObject) {
      if (replaceObject.hasOwnProperty(key)) {
        const val = replaceObject[key];
        if (typeof val === 'object') {
          for (const k in val) {
            if (val.hasOwnProperty(k)) {
              const v = val[k];
              body = content.replace(new RegExp(`{${key}.${k}}`, 'g'), v);
            }
          }
        } else {
          body = content.replace(new RegExp(`{${key}}`, 'g'), val);
        }
        //body = body.replace(new RegExp(`{${key}}`, "g"), val);
      }
    }
    this.body = body;
  }
  setCC(cc) {
    this.cc = cc;
  }
  setAttachements(attachments) {
    this.attachments = attachments;
  }

  async sendEmail(email) {
    if (!email) {
      throw new Error('Please provide email.');
    }
    const mailOption = {
      from: `Wyred <${process.env.MAIL_FROM_NAME}>`,
      to: email,
      cc: this.cc,
      subject: this.subject,
      html: this.body,
      attachments: this.attachments,
    };

    let resp = this.transporter.sendMail(mailOption);
    return resp;
  }
}

export { Email, AvailiableTemplates };
