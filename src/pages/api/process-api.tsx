// pages/api/analyze-dashboard.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import sgMail from '@sendgrid/mail';

import { supabase } from '@/client';
import OpenAI from 'openai';
sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '');

export const dynamic = 'force-dynamic';

// export const runtime = 'edge';

const parseSection = (content: string, sectionName: string) => {
  const regex = new RegExp(`${sectionName}:\\s*([^]*?)(?=\\n\\d\\.|$)`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : '';
};

const generateLink = async (token: String) => {
  const generatedLink = `${process.env.NEXT_PUBLIC_URL}results?token=${token}`;
  console.log(generatedLink, 'generatedLink');
  return generatedLink;
};

const sendEmailWithLink = async (
  toEmail: string,
  link: any,
  userName: string
) => {
  const msg = {
    to: toEmail, // Recipient email address
    from: {
      email: 'hello@visionlabs.com',
      name: 'Vision Labs Insights',
    }, // Your verified sender address
    subject: 'Here are some insights to improve your dashboard.',
    templateId: 'd-c4a496ad89d84b9c8b70777d75cdd373',
    dynamicTemplateData: {
      subject: `Here are some insights to improve your dashboard.`,
      username: userName,
      result_page_link: link,
    },

    isMultiple: false,
  };

  try {
    await sgMail.send(msg);
    console.log('❤❤❤');
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Unknown error occurred' };
    // }
  }
};

function generateRandomToken() {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const tokenLength = 32;
  let token = '';

  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const imageBase64 = req.body.image; // Assuming image is sent in base64 format
    const toEmail = req.body.email;
    // const userId = req.body.userId;
    const userName = req.body.userName;
    if (!imageBase64) {
      console.error('No image data found in the request body');
      return res.status(400).json({ message: 'No image data provided' });
    }

    const payload = {
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Attached is a Data Dashboard. Please reply in the following format:
              1. Purpose: [provide 3 positives & 7 areas improvement of the dashboard.]
              2. Positives:
               "Title": [Positive Aspect 1]
               "Description": [Positive Point 1 Description]
               "Title": [Positive Aspect 2]
               "Description": [Positive Point 2 Description]
               "Title": [Positive Aspect 3]
               "Description": [Positive Point 3 Description]
              3. Improvements:
               "Title": [Improvement Aspect 1]
               "Description": [Improvement Point 1 Description]
               "Possible Solution": [Your possible solution for Improvement Aspect 1]
               "Title": [Improvement Aspect 2]
               "Description": [Improvement Point 2 Description]
               "Possible Solution": [Your possible solution for Improvement Aspect 2]
               "Title": [Improvement Aspect 3]
               "Description": [Improvement Point 3 Description]
               "Possible Solution": [Your possible solution for Improvement Aspect 3]
               "Title": [Improvement Aspect 4]
               "Description": [Improvement Point 4 Description]
               "Possible Solution": [Your possible solution for Improvement Aspect 4]
               "Title": [Improvement Aspect 5]
               "Description": [Improvement Point 5 Description]
               "Possible Solution": [Your possible solution for Improvement Aspect 5]
               "Title": [Improvement Aspect 6]
               "Description": [Improvement Point 6 Description]
               "Possible Solution": [Your possible solution for Improvement Aspect 6]
               "Title": [Improvement Aspect 7]
               "Description": [Improvement Point 7 Description]
               "Possible Solution": [Your possible solution for Improvement Aspect 7]
              4. Rating: [provide appropriate score for readability, color usage, chart selection, understandability, accessibility out of 10]
               "Title": [Overall Score]
               "Score": [provide appropriate score for overall out of 10, between 2 and 10]
               "Description": [Overall Description] 
               "Title": [Readability]
               "Score": [provide appropriate score for readability out of 10, between 2 and 10]
               "Description": [Readability Description]
               "Title": [Color Usage]
               "Score": [provide appropriate score for color-usage out of 10, between 2 and 10]
               "Description": [Color Usage Description]
               "Title": [Chart Selection]
               "Score": [provide appropriate score for chart selection out of 10, between 2 and 10]
               "Description": [Chart Selection Description]
               "Title": [Understandability]
               "Score": [provide appropriate score for understandability out of 10, between 2 and 10]
               "Description": [Understandability Description]
               "Title": [Accessibility]
               "Score": [provide appropriate score for accessibility out of 10, between 2 and 10]
               "Description": [Accessibility Description]
              5. Dashboard: [Suggest a always unique and concise title for the dashboard, no longer than 3 words. Ensure it is appropriate and not empty.]
              Do not include anything on Mobile responsiveness.
              Ensure the analysis is grounded in the actual features of the dashboard, avoiding redundant or incorrect suggestions.
              Improvements section format like this [{"Title":"","Description":"","PossibleSolution":""},{"Title":"","Description":"","PossibleSolution":""}].
              Positives section format like this [{"Title":"","Description":""},{"Title":"","Description":""}].
              Rating section format like this [{"Title":"","Score":"","Description":""},{"Title":"","Score":"","Description":""}]
              Dashboard section's format like this "dashboard name"
              Never include a "-" at the beginning of any section.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 3000,
      // stream: true,
    };

    // const openai = new OpenAI({
    //   apiKey: process.env.OPENAI_API_KEY,
    // });

    // const response = await openai.chat.completions.create(payload);
    // let totalResponse = '';
    // for await (const part of response) {
    //   totalResponse = totalResponse.concat(part.choices[0].delta.content ?? '');
    // }


    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Use environment variable for API key
    };
    console.log('start axios');

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      payload,
      { headers }
    );

    const responseParsed = response.data;

    const reqTokens = responseParsed.usage.prompt_tokens;
    const resTokens = responseParsed.usage.completion_tokens;

    if (responseParsed.choices && responseParsed.choices.length > 0) {
      const content = responseParsed.choices[0].message.content;

      console.log("❤", content);
      // const content = totalResponse;

      const firstAnswer = parseSection(content, '1. Purpose');
      const secondAnswer = parseSection(content, '2. Positives');
      const thirdAnswer = parseSection(content, '3. Improvements');
      const fourthAnswer = parseSection(content, '4. Rating');
      const fifthAnswer = parseSection(content, '5. Dashboard');



      const apiResponse = {
        firstAnswer: firstAnswer,
        secondAnswer: secondAnswer,
        thirdAnswer: thirdAnswer,
        fourthAnswer: fourthAnswer,
        fifthAnswer: fifthAnswer,
      };

      console.log("❤");
      console.log(firstAnswer)
      console.log("❤");
      console.log(secondAnswer)
      console.log("❤");
      console.log(thirdAnswer)
      console.log("❤");
      console.log(fourthAnswer)
      console.log("❤");
      console.log(fifthAnswer)


      const { data, error } = await supabase
        .from('results')
        .upsert([
          {
            email: toEmail,
            // user_id: userId,
            image: imageBase64,
            positives: apiResponse.secondAnswer,
            improvements: apiResponse.thirdAnswer,
            rating: apiResponse.fourthAnswer,
            dashboard: apiResponse.fifthAnswer,
            token: generateRandomToken(),
            request_tokens: reqTokens,
            response_tokens: resTokens,
          },
        ])
        .select();

      if (error) {
        console.error('Supabase Error:', error.message);
        return res
          .status(500)
          .json({ message: 'Internal Server Error', error });
      }

      const token = data.map((d) => d.token).toString();

      const link = await generateLink(token);

      const emailResponse = await sendEmailWithLink(toEmail, link, userName);
      if (emailResponse.success) {
        res.status(200).json({
          message: emailResponse.message,
          data: { firstAnswer, secondAnswer, thirdAnswer, reqTokens, resTokens },
        });
        console.log('Email sent successfully');
      } else {
        res.status(500).json({ error: emailResponse.error });
        console.log('Unknown error occurred');
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // This means the error is related to Axios or the OpenAI API call
      res.status(500).json({ body: error.response?.data || error.message });
      console.error('Axios Error:', error.response?.data || error.message);
    } else {
      // Generic error
      console.error('Generic Error:', error);
    }
    res.status(500).json({ message: 'Internal Server Error', error });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // Set desired value here
    },
  },
  maxDuration: 120,
};
