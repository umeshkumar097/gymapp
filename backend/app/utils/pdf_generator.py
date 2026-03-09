import os
from io import BytesIO
from fpdf import FPDF
from datetime import datetime

class PassFitVoucher(FPDF):
    def header(self):
        # Premium dark header
        self.set_fill_color(30, 41, 59) # slate-800
        self.rect(0, 0, 210, 40, 'F')
        
        # Logo/Brand Name
        self.set_text_color(255, 255, 255)
        self.set_font("Helvetica", 'B', 28)
        self.set_xy(15, 12)
        self.cell(0, 10, "PassFit", ln=False, align="L")
        
        # Super title right
        self.set_font("Helvetica", 'B', 10)
        self.set_text_color(165, 180, 252) # indigo-300
        self.set_xy(0, 16)
        self.cell(195, 10, "OFFICIAL ENTRY VOUCHER", ln=False, align="R")

    def footer(self):
        self.set_y(-25)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(148, 163, 184) # slate-400
        self.cell(0, 10, "This is a computer-generated document. No signature is required.", 0, 0, "C")

def generate_premium_voucher(booking_id: str, user_name: str, gym_name: str, pass_type: str, date_str: str, otp: str) -> bytes:
    """
    Generates a stunning, pure-python PDF voucher using fpdf2.
    Returns the raw PDF bytes.
    """
    pdf = PassFitVoucher(orientation="P", unit="mm", format="A4")
    pdf.add_page()
    
    # Title "Your Pass is Confirmed!"
    pdf.set_y(55)
    pdf.set_font("Helvetica", "B", 24)
    pdf.set_text_color(15, 23, 42) # slate-900
    pdf.cell(0, 10, f"Hello {user_name}, you're all set! \x81\x82", ln=True, align="C") # Mock emoji since FPDF core fonts don't support full UTF-8 emojis
    
    pdf.set_y(65)
    pdf.set_font("Helvetica", "", 12)
    pdf.set_text_color(100, 116, 139) # slate-500
    pdf.cell(0, 10, "Please present the OTP below at the gym reception.", ln=True, align="C")
    
    # OTP Big Box
    pdf.set_y(85)
    pdf.set_fill_color(248, 250, 252) # slate-50
    pdf.rect(65, 85, 80, 35, 'F')
    
    pdf.set_y(90)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(79, 70, 229) # indigo-600
    pdf.cell(0, 10, "ENTRY PIN", ln=True, align="C")
    
    pdf.set_y(100)
    pdf.set_font("Helvetica", "B", 34)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 10, otp, ln=True, align="C")
    
    # Booking Details Section
    pdf.set_y(140)
    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 10, "Booking Summary", ln=True, align="L", border="B")
    
    pdf.set_y(155)
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(100, 116, 139)
    pdf.cell(50, 10, "Gym:", ln=False)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 10, gym_name, ln=True)
    
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(100, 116, 139)
    pdf.cell(50, 10, "Pass Type:", ln=False)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 10, pass_type, ln=True)
    
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(100, 116, 139)
    pdf.cell(50, 10, "Date & Time:", ln=False)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 10, date_str, ln=True)
    
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(100, 116, 139)
    pdf.cell(50, 10, "Booking ID:", ln=False)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 10, f"PASSFIT-{booking_id}", ln=True)
    
    # Guarantee badge mock
    pdf.set_y(220)
    pdf.set_fill_color(236, 253, 245) # emerald-50
    pdf.rect(15, 220, 180, 25, 'F')
    
    pdf.set_y(225)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(5, 150, 105) # emerald-600
    pdf.cell(0, 6, "100% PassFit Guarantee", ln=True, align="C")
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(4, 120, 87)
    pdf.cell(0, 6, "If you are denied entry, you get a full refund instantly.", ln=True, align="C")
    
    return bytes(pdf.output())

# Example testing wrapper
if __name__ == "__main__":
    pdf_bytes = generate_premium_voucher("8920", "John Doe", "Iron Core Fitness", "1 Day Pass", "2023-11-20 08:00 AM", "4291")
    with open("sample_voucher.pdf", "wb") as f:
        f.write(pdf_bytes)
    print("Voucher saved!")
