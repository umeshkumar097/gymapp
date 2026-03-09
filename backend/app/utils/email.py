import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

SMTP_HOST = "smtp.hostinger.com"
SMTP_PORT = 465
SMTP_USER = "info@passfit.in"
SMTP_PASS = "Umesh@2003##"

def send_welcome_email(to_email: str):
    """
    Sends a welcome email to the newly registered user using Hostinger SMTP.
    """
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Welcome to PassFit - Premium Fitness Access"
        msg["From"] = f"PassFit <{SMTP_USER}>"
        msg["To"] = to_email

        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px;">
                <div style="max-w: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <h1 style="color: #4f46e5; margin-top: 0;">Welcome to PassFit! 🏋️‍♂️</h1>
                    <p style="color: #334155; font-size: 16px; line-height: 1.5;">
                        Hello!<br><br>
                        We're thrilled to have you join <strong>PassFit</strong>, the ultimate platform for booking premium fitness passes across your city with no string attached.
                    </p>
                    <p style="color: #334155; font-size: 16px; line-height: 1.5;">
                        Whether you're looking for a quick day pass to a luxury gym or exploring monthly flexi-memberships, we've got you covered.
                    </p>
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="http://localhost:3000" style="background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">
                            Start Exploring Gyms
                        </a>
                    </div>
                </div>
            </body>
        </html>
        """
        
        part = MIMEText(html_content, "html")
        msg.attach(part)

        server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT)
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(SMTP_USER, to_email, msg.as_string())
        server.quit()
        print(f"✅ Welcome email sent successfully to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {str(e)}")
        return False

def send_first_booking_email(to_email: str, user_name: str, gym_name: str):
    """
    Sends a highly encouraging celebration email for their first booking.
    """
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "🎉 You took the first step! Let the gains begin!"
        msg["From"] = f"PassFit <{SMTP_USER}>"
        msg["To"] = to_email

        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px;">
                <div style="max-w: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <h1 style="color: #10b981; margin-top: 0; font-size: 32px;">Woohoo! 🚀</h1>
                    <p style="color: #334155; font-size: 18px; line-height: 1.6;">
                        <strong>{user_name}</strong>, huge congratulations on booking your very first session with PassFit at <strong>{gym_name}</strong>.
                    </p>
                    <p style="color: #64748b; font-size: 16px; line-height: 1.5;">
                        The hardest part is showing up. We are so proud of you for taking this step towards a healthier, stronger you. Have an amazing workout!
                    </p>
                </div>
            </body>
        </html>
        """
        
        part = MIMEText(html_content, "html")
        msg.attach(part)
        server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT)
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(SMTP_USER, to_email, msg.as_string())
        server.quit()
        print(f"✅ First Booking celebration email sent to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send First Booking email: {str(e)}")
        return False

def send_booking_confirmation_email(to_email: str, gym_name: str, otp: str, pass_type: str, date_str: str, pdf_bytes: bytes = None, gym_image_url: str = None):
    """
    Sends a premium booking confirmation containing the Entry OTP and an attached PDF.
    """
    try:
        msg = MIMEMultipart("mixed")
        msg["Subject"] = f"Booking Confirmed: {gym_name}"
        msg["From"] = f"PassFit Bookings <{SMTP_USER}>"
        msg["To"] = to_email

        # Fallback image if none provided
        bg_image = gym_image_url if gym_image_url else "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1469&auto=format&fit=crop"

        html_content = f"""
        <html>
            <body style="font-family: 'Inter', Arial, sans-serif; background-color: #f3f4f6; padding: 20px; margin: 0;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                    <!-- Hero Image -->
                    <div style="width: 100%; height: 250px; background-color: #e5e7eb; background-image: url('{bg_image}'); background-size: cover; background-position: center;">
                    </div>
                    
                    <div style="padding: 40px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h2 style="color: #111827; margin: 0; font-size: 24px; font-weight: 800;">Your Booking is Confirmed! 🎉</h2>
                            <p style="color: #6b7280; font-size: 16px; margin-top: 8px;">Get ready to crush your fitness goals at {gym_name}.</p>
                        </div>
                        
                        <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px; border-radius: 16px; text-align: center; color: white; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(79, 70, 229, 0.2);">
                            <p style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; opacity: 0.9;">Your Secure Entry PIN</p>
                            <p style="margin: 0; font-size: 48px; font-weight: 900; letter-spacing: 6px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">{otp}</p>
                            <p style="margin: 10px 0 0 0; font-size: 13px; opacity: 0.8;">Show this PIN at the front desk</p>
                        </div>

                        <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                            <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Booking Details</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 40%;">Gym</td>
                                    <td style="padding: 8px 0; color: #0f172a; font-size: 15px; font-weight: 600; text-align: right;">{gym_name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Pass Type</td>
                                    <td style="padding: 8px 0; color: #0f172a; font-size: 15px; font-weight: 600; text-align: right;">{pass_type}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Date &amp; Time</td>
                                    <td style="padding: 8px 0; color: #0f172a; font-size: 15px; font-weight: 600; text-align: right;">{date_str}</td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style="text-align: center;">
                            <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                                Need to cancel or reschedule? Manage your booking easily through the PassFit app.
                            </p>
                            {'<p style="color: #4f46e5; font-weight: 600; font-size: 14px; margin: 0;">📎 Premium Entry Voucher Attached</p>' if pdf_bytes else ''}
                        </div>
                    </div>
                </div>
            </body>
        </html>
        """
        
        alt_part = MIMEMultipart("alternative")
        alt_part.attach(MIMEText(html_content, "html"))
        msg.attach(alt_part)
        
        if pdf_bytes:
            from email.mime.application import MIMEApplication
            pdf_part = MIMEApplication(pdf_bytes, _subtype="pdf")
            pdf_part.add_header('Content-Disposition', 'attachment', filename=f"PassFit_Voucher_{otp}.pdf")
            msg.attach(pdf_part)

        server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT)
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(SMTP_USER, to_email, msg.as_string())
        server.quit()
        print(f"✅ Booking Confirmation email sent to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send Booking Confirmation email: {str(e)}")
        return False

def send_workout_reminder_email(to_email: str, user_name: str, gym_name: str, otp: str, gym_image_url: str = None):
    """
    Sends a friendly reminder 1 hour before the start of the workout.
    """
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Your workout at {gym_name} starts soon! 🏃‍♂️"
        msg["From"] = f"PassFit Reminders <{SMTP_USER}>"
        msg["To"] = to_email

        bg_image = gym_image_url if gym_image_url else "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop"

        html_content = f"""
        <html>
            <body style="font-family: 'Inter', Arial, sans-serif; background-color: #f3f4f6; padding: 20px; margin: 0;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                    <div style="width: 100%; height: 200px; background-color: #e5e7eb; background-image: url('{bg_image}'); background-size: cover; background-position: center;">
                    </div>
                    <div style="padding: 40px; text-align: center;">
                        <h2 style="color: #111827; margin: 0; font-size: 24px; font-weight: 800;">Get Ready, {user_name}! ⚡️</h2>
                        <p style="color: #6b7280; font-size: 16px; margin-top: 15px; line-height: 1.6;">
                            Just a quick reminder that your premium gym session at <strong>{gym_name}</strong> starts soon! Don't forget your gym shoes, a water bottle, and your energy. 
                        </p>
                        
                        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 25px 0;">
                            <p style="margin: 0 0 5px 0; color: #64748b; font-size: 13px; text-transform: uppercase; font-weight: bold;">Quick Entry PIN</p>
                            <p style="margin: 0; color: #4f46e5; font-size: 32px; font-weight: 900; letter-spacing: 4px;">{otp}</p>
                        </div>

                        <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
                            See you at the gym! Let's crush those goals. 💪
                        </p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        part = MIMEText(html_content, "html")
        msg.attach(part)
        server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT)
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(SMTP_USER, to_email, msg.as_string())
        server.quit()
        print(f"✅ Workout Reminder email sent to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send Workout Reminder email: {str(e)}")
        return False

def send_booking_expired_email(to_email: str, user_name: str, gym_name: str):
    """
    Sends an email when the booking has expired / ended, encouraging them to book again.
    """
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "How was your workout? 🏋️‍♀️"
        msg["From"] = f"PassFit <{SMTP_USER}>"
        msg["To"] = to_email

        html_content = f"""
        <html>
            <body style="font-family: 'Inter', Arial, sans-serif; background-color: #f3f4f6; padding: 20px; margin: 0;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                    <h2 style="color: #111827; margin: 0; font-size: 24px; font-weight: 800;">Hope you crushed it, {user_name}! 🔥</h2>
                    <p style="color: #6b7280; font-size: 16px; margin-top: 15px; line-height: 1.6;">
                        Your pass for <strong>{gym_name}</strong> has just ended. We hope you had an amazing, sweat-filled session.
                    </p>
                    <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
                        Don't let the momentum stop here! Consistency is key. Book your next flexi-pass right away to keep your streak going. 
                    </p>
                    <div style="margin-top: 30px;">
                        <a href="https://passfit.in" style="background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">
                            Keep the streak alive
                        </a>
                    </div>
                </div>
            </body>
        </html>
        """
        
        part = MIMEText(html_content, "html")
        msg.attach(part)
        server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT)
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(SMTP_USER, to_email, msg.as_string())
        server.quit()
        print(f"✅ Booking Expired email sent to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send Booking Expired email: {str(e)}")
        return False

