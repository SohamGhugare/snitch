import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const { contract, systemPrompt } = await req.json();
    if (!contract || !systemPrompt) {
      return NextResponse.json({ error: 'Missing contract or systemPrompt' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_OPENAI_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing OpenAI API key' }, { status: 500 });
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: contract }
    ];

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages,
        max_tokens: 2000,
        temperature: 0.2,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const auditReport = response.data.choices[0].message.content;
    return NextResponse.json({ auditReport });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 