import type { NextApiRequest, NextApiResponse } from 'next';
import {integrateActiveCampaign} from '../../utils/activeCampaign';

export default async function handler(  req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {email, userName } = req.body;
        const [firstName, lastName] = userName.split(' '); // Split the username into first and last names

        try {
            // Integrate with ActiveCampaign
            const acResponse = await integrateActiveCampaign(email, firstName, lastName);

            res.status(200).json({ success: true, activeCampaignData: acResponse });
        } catch (error) {
            res.status(500).json({ success: false, error: "Active campaign response error" });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
