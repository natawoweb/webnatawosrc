import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, sourceLang = 'auto', targetLang } = await req.json();
    const apiKey = Deno.env.get('GOOGLE_TRANSLATE_API_KEY');

    if (!apiKey) {
      throw new Error('Google Translate API key not found');
    }

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLang,
          source: sourceLang === 'auto' ? undefined : sourceLang,
        }),
      }
    );

    const data = await response.json();

    // Check if the response has the expected structure
    if (!data.data?.translations?.[0]?.translatedText) {
      throw new Error('Invalid response from Google Translate API');
    }

    const translatedText = data.data.translations[0].translatedText;

    return new Response(JSON.stringify({ translatedText }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Translation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});
