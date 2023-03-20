exports.helloWorld = (req, res) => {
    let message = req.query.message || req.body.message || 'Hello World!';

    const jsonResponse = {
        fulfillment_response: {
            messages: [{
                text: {
                    // fulfillment text response to be sent to the agen
                    text: [message],
                },
            }, ],
        },
    };
    //res.status(200).send(message);
    res.status(200).send(jsonResponse);
};