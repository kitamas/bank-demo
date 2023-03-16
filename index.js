/**
https://cloud.google.com/dialogflow/cx/docs/concept/agents-prebuilt#financial-services
index.js
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

exports.cxPrebuiltAgentsFinServ = (req, res) => {
  console.log('Cloud Function:', 'Invoked cloud function from Dialogflow');
  let tag = req.body.fulfillmentInfo.tag;

  if (!!tag) {
    switch (tag) {
      // BEGIN validateAccount
      case 'validateAccount':
        console.log(tag + ' was triggered.');
        let card_last_four = req.body.sessionInfo.parameters.card_last_four;

        let card_verified;
        // card validation only fails if card number is 0000
        if (card_last_four == '0000') {
          card_verified = 'false';
        } else {
          card_verified = 'true';
        }

        res.status(200).send(
            {sessionInfo: {parameters: {card_verified: card_verified}}});

        console.log(' verified: ' + card_verified);
        break;

      // BEGIN getAccountInfo
      case 'getAccountInfo':
        console.log(tag + ' was triggered.');
        let current_balance;
        let last_statement_balance;
        let minimum_due;

        // Random current balance between 1 and 1000
        current_balance = Math.floor(Math.random() * 1000);

        // Last statement balance is 70% of current balance
        last_statement_balance = Math.floor(current_balance * 0.7);

        // Minimum due is 25% of last statement balance
        minimum_due = Math.floor(last_statement_balance * 0.25);

        res.status(200).send({
          sessionInfo: {
            parameters: {
              current_balance: current_balance,
              last_statement_balance: last_statement_balance,
              minimum_due: minimum_due
            }
          }
        });

        console.log(
            'current balance: ' + current_balance +
            ' last statement balance: ' + last_statement_balance);
        break;

     

      default:
        console.log('default case called');
        res.status(200).end();
        break;
    }
  }
};
               