const axios = require('axios');
const baseURL = process.env.ACTIVECAMPAIGN_API_URL
const config = {
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        // 'Api-Token': process.env.ACTIVECAMPAIGN_API_KEY
        'Api-Token': process.env.ACTIVECAMPAIGN_API_KEY
    }
};

async function integrateActiveCampaign(email, firstName, lastName, companySize) {
    try {
     
        const searchResponse = await axios.get(`${baseURL}/contacts`, {
            params: { email: email },
            ...config
        });

        let newContactId;

        if (searchResponse.data.contacts.length === 0) {
            // Contact does not exist, create a new contact
            const contactResponse = await axios.post(`${baseURL}/contacts`, {
                contact: {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    fieldValues: [
                        { field: '1', value: companySize },
                    ]
                }
            }, config);
            console.log('New Contact:', contactResponse.data);
            newContactId = contactResponse.data.contact.id;
        } else {
            // Contact exists, get the existing contact ID
            newContactId = searchResponse.data.contacts[0].id;
            console.log('Contact Already Exists:', newContactId);
        }
        console.log("❤")
        console.log('new contact', newContactId)

        // Update list status for the contact
        const listStatusResponse = await axios.post(`${baseURL}/contactLists`, {
            contactList: {
                contact: newContactId,
                list: 15,
                status: 1
            }
        }, config);
        console.log('List Status Updated:', listStatusResponse.data);

        // Create a contact tag
        const tagResponse = await axios.post(`${baseURL}/contactTags`, {
            contactTag: {
                contact: newContactId,
                tag: 108
            }
        }, config);
        console.log('Contact Tag Created:', tagResponse.data);

        return {
            contactId: newContactId,
            listStatus: listStatusResponse.data,
            tag: tagResponse.data
        };
    } catch (err) {
        console.error(err);
        throw err; // Rethrow the error to handle it in the calling function
        return { success: false, error: tagResponse.error };
    }
}


async function deleteContact() {
    const axios = require('axios');

    const options = {
        method: 'DELETE',
        url: 'https://mediauthentic.api-us1.com/api/3/contacts/5265',
        headers: {
            accept: 'application/json',
            'Api-Token': 'ac0115b1967392b6dac7945856975e094df75b2ced5e9b9048de59ec279c7ac88dff1a6e'
        }
    };

    axios
        .request(options)
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.error(error);
        });
}

module.exports = {
    integrateActiveCampaign,
    deleteContact
};