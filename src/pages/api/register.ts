import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import sgMail from '@sendgrid/mail';
import { sendVerificationEmail } from 'mail';
import { v4 as uuidv4 } from 'uuid'; // Dodaj 'uuid' do zależności projektu

export const POST = async (request: NextRequest) => {
  const { username, email, password } = await request.json();
  const hashedPassword = await bcrypt.hash(password, 5);
  const emailToken = uuidv4(); // Generowanie unikalnego tokena
  try {
    await sendVerificationEmail(email, emailToken); // Wysyłanie e-maila weryfikacyjnego
    return new Response(JSON.stringify({ message: 'User has been created and verification email sent.' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
