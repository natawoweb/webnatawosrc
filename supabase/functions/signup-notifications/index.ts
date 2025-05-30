import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface NotificationPayload {
  type:
    | 'writer_request'
    | 'reader_welcome'
    | 'writer_welcome'
    | 'request_submitted';
  email: string;
  fullName: string;
  adminEmails?: string[];
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (!resendKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const payload = await req.json();

    const {
      type,
      email,
      fullName,
      adminEmails = [],
    }: NotificationPayload = payload;

    switch (type) {
      case 'writer_request':
        // Notify admins about new writer request
        for (const adminEmail of adminEmails) {
          try {
            const result = await resend.emails.send({
              from: 'NATAWO <onboarding@resend.dev>',
              to: adminEmail,
              subject: 'New Writer Request',
              html: `
                <h1>New Writer Request</h1>
                <p>A new writer request has been submitted:</p>
                <p>Name: ${fullName}</p>
                <p>Email: ${email}</p>
                <p><a href="${Deno.env.get(
                  'PUBLIC_SITE_URL'
                )}/admin">Click here to review the request</a></p>
              `,
            });
          } catch (error) {
            console.error('Error sending admin notification:', error);
            throw error;
          }
        }
        break;

      case 'reader_welcome':
        try {
          const result = await resend.emails.send({
            from: 'NATAWO <onboarding@resend.dev>',
            to: email,
            subject: 'Welcome to NATAWO!',
            html: `
              <h1>Welcome to NATAWO!</h1>
              <p>Dear ${fullName},</p>
              <p>Thank you for joining NATAWO. Your reader account has been created successfully.</p>
              <p>You can now explore our content and interact with our community.</p>
            `,
          });
        } catch (error) {
          console.error('Error sending reader welcome email:', error);
          throw error;
        }
        break;

      case 'request_submitted':
        try {
          const result = await resend.emails.send({
            from: 'NATAWO <onboarding@resend.dev>',
            to: email,
            subject: 'Writer Application Submitted',
            html: `
              <h1>Application Received</h1>
              <p>Dear ${fullName},</p>
              <p>Your application to become a writer at NATAWO has been received.</p>
              <p>We will review your application and get back to you soon.</p>
            `,
          });
        } catch (error) {
          console.error('Error sending writer confirmation email:', error);
          throw error;
        }
        break;

      case 'writer_welcome':
        try {
          const result = await resend.emails.send({
            from: 'NATAWO <onboarding@resend.dev>',
            to: email,
            subject: 'Welcome to NATAWO Writers!',
            html: `
              <h1>Welcome to NATAWO Writers!</h1>
              <p>Dear ${fullName},</p>
              <p>Your application to become a writer has been approved!</p>
              <p>You can now start creating and sharing your content with our community.</p>
            `,
          });
        } catch (error) {
          console.error('Error sending writer welcome email:', error);
          throw error;
        }
        break;

      default:
        throw new Error(`Invalid notification type: ${type}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in signup-notifications:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
