const sendSmsVerification = async (phoneNumber) => {
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
        console.log("accountSid", accountSid);
        console.log("authToken", authToken);
        console.log("serviceSid", serviceSid);

        const basicAuth = btoa(`${accountSid}:${authToken}`);

        const response = await fetch(
            `https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${basicAuth}`
                },
                body: new URLSearchParams({
                    To: phoneNumber,
                    Channel: "sms"
                }).toString()
            }
        );

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Twilio API error: ${response.status} - ${errorBody}`);
        }

        const json = await response.json();
        return json.status === 'pending';
    } catch (error) {
        console.error("Verification send error:", error);
        return false;
    }
};

const checkVerification = async (phoneNumber, code) => {
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

        const basicAuth = btoa(`${accountSid}:${authToken}`);

        const response = await fetch(
            `https://verify.twilio.com/v2/Services/${serviceSid}/VerificationCheck`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${basicAuth}`
                },
                body: new URLSearchParams({
                    To: phoneNumber,
                    Code: code,
                    Channel: "sms"
                }).toString()
            }
        );

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Twilio API error: ${response.status} - ${errorBody}`);
        }

        const json = await response.json();
        return json.status === 'approved';
    } catch (error) {
        console.error("Verification check error:", error);
        return false;
    }
};

module.exports = {
    sendSmsVerification,
    checkVerification
};
