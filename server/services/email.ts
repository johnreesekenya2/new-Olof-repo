import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fsocietycipherrevolt@gmail.com',
    pass: 'aknz caun egok ihri'
  }
});

export async function sendVerificationEmail(email: string, name: string, code: string): Promise<void> {
  const mailOptions = {
    from: 'fsocietycipherrevolt@gmail.com',
    to: email,
    subject: 'OLOF Alumni - Email Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #4f46e5, #10b981); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span style="color: white; font-size: 24px;">🎓</span>
          </div>
          <h1 style="color: #4f46e5; margin: 0;">OLOF ALUMNI</h1>
          <p style="color: #9ca3af; margin: 5px 0;">Our Lady of Fatima Secondary School</p>
        </div>
        
        <div style="background-color: #2d2d2d; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #ffffff; margin-bottom: 15px;">Hi ${name}! 👋</h2>
          <p style="color: #d1d5db; line-height: 1.6; margin-bottom: 20px;">
            Welcome to the OLOF Alumni Community! We're excited to have you join our network of graduates.
          </p>
          <p style="color: #d1d5db; line-height: 1.6; margin-bottom: 25px;">
            To complete your registration and start connecting with fellow alumni, please verify your email address using the verification code below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: linear-gradient(45deg, #4f46e5, #10b981); padding: 3px; border-radius: 10px; display: inline-block;">
              <div style="background-color: #1a1a1a; padding: 20px 40px; border-radius: 8px;">
                <span style="color: #ffffff; font-size: 36px; font-weight: bold; letter-spacing: 8px;">${code}</span>
              </div>
            </div>
          </div>
          
          <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 20px;">
            This code will expire in 15 minutes for security reasons.
          </p>
        </div>
        
        <div style="background-color: #374151; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #10b981; margin-bottom: 15px;">What's Next?</h3>
          <ul style="color: #d1d5db; line-height: 1.6; padding-left: 20px;">
            <li>Enter the verification code on the website</li>
            <li>Complete your profile setup</li>
            <li>Start connecting with fellow OLOF alumni</li>
            <li>Join discussions and share your experiences</li>
          </ul>
        </div>
        
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #374151;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            POWERED BY PASCAL ERICK (2023 G-CLAN) | Hosted at johnreeselegacies.tech:3000
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const mailOptions = {
    from: 'fsocietycipherrevolt@gmail.com',
    to: email,
    subject: 'Welcome to OLOF Alumni Community! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #4f46e5, #10b981); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span style="color: white; font-size: 24px;">🎓</span>
          </div>
          <h1 style="color: #4f46e5; margin: 0;">WELCOME TO OLOF ALUMNI!</h1>
          <p style="color: #9ca3af; margin: 5px 0;">Our Lady of Fatima Secondary School</p>
        </div>
        
        <div style="background: linear-gradient(45deg, #4f46e5, #10b981); padding: 3px; border-radius: 12px; margin-bottom: 20px;">
          <div style="background-color: #1a1a1a; padding: 25px; border-radius: 10px;">
            <h2 style="color: #ffffff; margin-bottom: 15px;">🎉 Congratulations ${name}!</h2>
            <p style="color: #d1d5db; line-height: 1.6; margin-bottom: 20px;">
              Your email has been successfully verified and you're now part of the OLOF Alumni Community!
            </p>
            <p style="color: #d1d5db; line-height: 1.6;">
              We're thrilled to have you join us in this amazing network of Our Lady of Fatima Secondary School graduates.
            </p>
          </div>
        </div>
        
        <div style="background-color: #2d2d2d; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #10b981; margin-bottom: 20px;">🚀 What You Can Do Now:</h3>
          <div style="margin-bottom: 15px;">
            <span style="color: #4f46e5; font-weight: bold;">🏠 Home:</span>
            <span style="color: #d1d5db; margin-left: 10px;">Share posts, photos, and connect with classmates</span>
          </div>
          <div style="margin-bottom: 15px;">
            <span style="color: #4f46e5; font-weight: bold;">📊 Database:</span>
            <span style="color: #d1d5db; margin-left: 10px;">Browse and search for fellow alumni by year and clan</span>
          </div>
          <div style="margin-bottom: 15px;">
            <span style="color: #4f46e5; font-weight: bold;">💬 Inbox:</span>
            <span style="color: #d1d5db; margin-left: 10px;">Send private messages and start conversations</span>
          </div>
          <div style="margin-bottom: 15px;">
            <span style="color: #4f46e5; font-weight: bold;">🔔 Notifications:</span>
            <span style="color: #d1d5db; margin-left: 10px;">Stay updated on community activities</span>
          </div>
          <div style="margin-bottom: 15px;">
            <span style="color: #4f46e5; font-weight: bold;">📸 Gallery:</span>
            <span style="color: #d1d5db; margin-left: 10px;">Share and view memorable moments</span>
          </div>
        </div>
        
        <div style="background-color: #374151; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #fbbf24; margin-bottom: 15px;">💫 Community Guidelines:</h3>
          <ul style="color: #d1d5db; line-height: 1.6; padding-left: 20px;">
            <li>Be respectful and supportive of fellow alumni</li>
            <li>Share positive experiences and achievements</li>
            <li>Help mentoring and volunteering initiatives</li>
            <li>Keep the OLOF spirit alive in all interactions</li>
          </ul>
        </div>
        
        <div style="text-align: center; padding: 20px 0;">
          <p style="color: #10b981; font-size: 18px; font-weight: bold; margin-bottom: 10px;">
            Welcome to the family! 🏠
          </p>
          <p style="color: #d1d5db; line-height: 1.6;">
            Whether you're looking to network, give back, or simply stay connected, 
            we invite you to explore, engage, and be an active part of our community.
          </p>
        </div>
        
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #374151;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            POWERED BY PASCAL ERICK (2023 G-CLAN) | Hosted at johnreeselegacies.tech:3000
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}
