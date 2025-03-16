/* eslint-disable @typescript-eslint/no-explicit-any */

export async function sendWelcomeNotification(
  supabaseAdmin: any,
  payload: {
    email: string;
    fullName: string;
    role: string;
  }
) {
  try {
    const notificationType =
      payload.role === 'writer' ? 'writer_welcome' : 'reader_welcome';
    const { error: notificationError } = await supabaseAdmin.functions.invoke(
      'signup-notifications',
      {
        body: {
          type: notificationType,
          email: payload.email,
          fullName: payload.fullName,
        },
      }
    );

    if (notificationError) {
      console.error('Error sending welcome notification:', notificationError);
    } else {
      console.log('Welcome notification sent successfully');
    }
  } catch (notificationError) {
    console.error(
      'Error invoking signup-notifications function:',
      notificationError
    );
  }
}
