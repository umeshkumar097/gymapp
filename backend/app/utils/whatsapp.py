import os
import requests

# Set these in your .env later when you get the Interakt/Twilio credentials
WHATSAPP_API_URL = os.getenv("WHATSAPP_API_URL", "https://api.interakt.ai/v1/public/message/")
WHATSAPP_API_KEY = os.getenv("WHATSAPP_API_KEY", "mock_key_for_now")

def _send_mock_whatsapp(to_number: str, template_name: str, payload_data: dict, attachment_url: str = None):
    """
    Internal mock function that simulates sending a WhatsApp message and beautifully logs it.
    """
    print(f"\n{'='*50}")
    print(f"🟩 📱 MOCK WHATSAPP API TRIGGERED 📱 🟩")
    print(f"   To: {to_number}")
    print(f"   Template: {template_name}")
    print(f"   Data: {payload_data}")
    if attachment_url:
        print(f"   📎 Attachment Included: {attachment_url}")
    print(f"{'='*50}\n")
    return True

def send_otp_whatsapp(to_number: str, otp_code: str):
    """
    Trigger: User requests login OTP
    Sends a real WhatsApp message using Meta Cloud API.
    """
    # Meta WhatsApp Cloud API credentials provided by user
    PHONE_NUMBER_ID = "1082771188242559"
    ACCESS_TOKEN = "EAANPIHaxlO4BQOPfWEQFL0fmivpSB09yb36B84HIt08im5yLv6VsZC2fFFo9xOZBfBl2i7LzSMRDD5UIisK2O5AekJtlhYYMj38xyEkZByipNIP1P7qeIjK2bFA4nrVjaM0G7yvZAIw4ZCptMXc2gdMxaAjiWKEd9z4q758ff9nvpNf3763dJDMpHMiMdXAZDZD"
    URL = f"https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages"
    
    # Format number: remove any + and ensure it starts with country code (e.g. 91)
    clean_number = to_number.replace("+", "").strip()
    if len(clean_number) == 10:
        clean_number = f"91{clean_number}"
        
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "messaging_product": "whatsapp",
        "to": clean_number,
        "type": "template",
        "template": {
            "name": "otp",
            "language": {
                "code": "en"
            },
            "components": [
                {
                    "type": "body",
                    "parameters": [
                        {
                            "type": "text",
                            "text": str(otp_code)
                        },
                        {
                            "type": "text",
                            "text": "+91 97711 46864"
                        }
                    ]
                }
            ]
        }
    }
    
    try:
        response = requests.post(URL, headers=headers, json=payload, timeout=10)
        print(f"WhatsApp API Response: {response.status_code} - {response.text}")
        
        # If the button parameter causes an error, try without the button component
        if response.status_code != 200 and "components" in response.text:
            print("Retrying without button component...")
            payload["template"]["components"].pop()
            response = requests.post(URL, headers=headers, json=payload, timeout=10)
            print(f"WhatsApp API Retry Response: {response.status_code} - {response.text}")
            
        return response.ok
    except Exception as e:
        print(f"Error sending WhatsApp OTP: {e}")
        return False

def send_welcome_whatsapp(to_number: str, user_name: str):
    """
    Trigger: Account Creation
    """
    payload = {
        "text": f"Welcome to the family, {user_name}! 🚀 Ready to crush your fitness goals? Book your first premium gym pass today with zero commitments!"
    }
    return _send_mock_whatsapp(to_number, "welcome_message", payload)

def send_first_booking_whatsapp(to_number: str, user_name: str, gym_name: str):
    """
    Trigger: booking_count == 1
    """
    payload = {
        "text": f"Woohoo! 🎉 {user_name}, you just took the first step on your fitness journey with PassFit by booking at {gym_name}! We are so proud of you. Let's get those gains! 💪"
    }
    return _send_mock_whatsapp(to_number, "first_booking_celebration", payload)

def send_booking_confirmation_whatsapp(to_number: str, gym_name: str, otp: str, pass_type: str, pdf_url: str = None):
    """
    Trigger: Every Booking success
    """
    payload = {
        "text": f"Your {pass_type} for {gym_name} is confirmed! ✅\n\n🔑 Entry PIN: {otp}\n\nPresent this PIN at the reception desk to begin your workout. Enjoy your session!"
    }
    return _send_mock_whatsapp(to_number, "booking_confirmed", payload, attachment_url=pdf_url)

def send_post_workout_checkin_whatsapp(to_number: str, gym_name: str):
    """
    Trigger: 2 hours after pass expiry
    """
    payload = {
        "text": f"Hey there! 🏋️‍♀️ How was your session at {gym_name} today?\n\nDrop a quick 1-5 star review on the app to help others, and don't forget to book your next workout to keep the momentum going! 🔥"
    }
    return _send_mock_whatsapp(to_number, "post_workout_review", payload)
