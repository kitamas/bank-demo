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

      // BEGIN getPaymentSource
      case 'getPaymentSource':
        console.log(tag + ' was triggered.');

        // static array of account names
        let account_names =
            ['National Checking Account', 'My Checking', 'Personal Checking'];

        // random array value for account names
        let account_index = Math.floor(Math.random() * account_names.length);
        let selected_account = account_names[account_index];

        res.status(200).send(
            {sessionInfo: {parameters: {selected_account: selected_account}}});

        console.log(' selected account: ' + selected_account);
        break;

      // BEGIN submitPayment
      case 'submitPayment':
        console.log(tag + ' was triggered.');

        let card_digits =
            String(req.body.sessionInfo.parameters.card_last_four);

        let payment_status;
        // When first digit of card_digits is 9 the transaction fails
        if (card_digits[0] == '9') {
          payment_status = 'fail';
        } else {
          payment_status = 'success';
        }

        res.status(200).send(
            {sessionInfo: {parameters: {payment_status: payment_status}}});

        console.log(' verified: ' + card_verified);
        break;

      // BEGIN validatePaymentAmount
      case 'validatePaymentAmount':
        console.log(tag + ' was triggered.');

        // get payment amount
        let payment_amount =
            Number(req.body.sessionInfo.parameters.other_amount);
        let current_balance_temp =
            req.body.sessionInfo.parameters.current_balance;
        let amount_valid;

        payment_amount = Number(payment_amount);

        console.log(
            `payment_amount: ` + payment_amount + ` current balance: ` +
            current_balance_temp);

        // confirm payment amount is a positive value less than or equal to the
        // current balance
        if (payment_amount > 0) {
          if (payment_amount <= current_balance_temp) {
            amount_valid = true;
          } else {
            amount_valid = false;
          }
        } else {
          amount_valid = false;
        }

        res.status(200).send(
            {sessionInfo: {parameters: {amount_valid: amount_valid}}});

        console.log('payment status: ' + payment_status);
        break;

      // BEGIN validatePaymentDate
      case 'validatePaymentDate':
        console.log(tag + ' was triggered.');

        // get payment date
        let payment_date_raw = req.body.sessionInfo.parameters.payment_date;

        // set payment date in date object format. subtract one from month
        // because month is indexed to 0.
        let payment_year = payment_date_raw.year;
        let payment_month = payment_date_raw.month - 1;
        let payment_day = payment_date_raw.day;

        console.log(
            'Payment - Year: ' + payment_year + ' Month ' + payment_month +
            ' Day: ' + payment_day);

        // set today's date
        let today = new Date();

        let this_year = today.getFullYear();
        let this_month = today.getMonth();
        let this_day = today.getDate();

        console.log(
            'Today - Year: ' + this_year + ' Month ' + this_month +
            ' Day: ' + this_day);

        let payment_date_valid;

        // check if the payment date is after today
        if (payment_year > this_year) {
          payment_date_valid = true;
          console.log('Future year');
        } else if (payment_year == this_year && payment_month > this_month) {
          payment_date_valid = true;
          console.log('Future month');
        } else if (
            payment_year == this_year && payment_month == this_month &&
            payment_day >= this_day) {
          payment_date_valid = true;
          console.log('Today or later this month');
        } else {
          payment_date_valid = false;
        }


        res.status(200).send({
          sessionInfo: {parameters: {payment_date_valid: payment_date_valid}}
        });

        console.log('payment date valid: ' + payment_date_valid);
        break;

      // BEGIN checkInHours
      case 'checkInHours':
        console.log(tag + ' was triggered.');

        // check if we are currently in hours
        let currentDate = new Date();
        console.log('current time is  ' + currentDate);

        let currentHour = currentDate.getHours();
        console.log('current hour is ' + currentHour);
        if (currentHour >= 8 && currentHour <= 20) {
          in_hours = 'true';
          console.log('currently in hours');
        } else {
          in_hours = 'false';
          console.log('currently out of hours');
        }

        res.status(200).send({sessionInfo: {parameters: {in_hours: in_hours}}});
        break;

      // BEGIN getRetryCount
      case 'getRetryCount':
        console.log(tag + ' was triggered.');

        // increment the current retry counter
        let retry_count = req.body.sessionInfo.parameters.retry_count;
        retry_count = retry_count + 1;

        res.status(200).send(
            {sessionInfo: {parameters: {retry_count: retry_count}}});
        break;

      // BEGIN getLoanStatus
      case 'getLoanStatus':
        console.log(tag + ' was triggered.');

        let loan_reference =
            String(req.body.sessionInfo.parameters.loan_reference);
        let loan_type = loan_reference[0];
        let loan_status = loan_reference[1];
        let loan_found = 'true';

        console.log('loan ref is ' + loan_reference);
        console.log('type is ' + loan_type);
        console.log('status is ' + loan_status);

        // mock loan not found
        if (loan_reference[0] == '0') {
          loan_found = 'false';
        }

        // mock loan found
        if ((loan_type != 'auto') && (loan_type != 'home')) {
          if (loan_reference[0] > '5') {
            loan_type = 'home';
          } else {
            loan_type = 'auto';
          }
        }

        res.status(200).send({
          sessionInfo: {
            parameters: {
              loan_type: loan_type,
              loan_status: loan_status,
              loan_found: loan_found
            }
          }
        });
        break;

      // BEGIN validateTransactionDate
      case 'validateTransactionDate':
        console.log(tag + ' was triggered.');

        // get date queried
        let date_queried_raw = req.body.sessionInfo.parameters.date_queried;

        // set date queried in date object format. subtract one from month
        // because month is indexed to 0.
        date_queried = new Date(
            date_queried_raw.year, date_queried_raw.month - 1,
            date_queried_raw.day);

        console.log(date_queried + ' is the date im looking for.');

        let date_valid;
        let date_now = new Date();

        // check if the payment date is after today
        if (date_queried > date_now) {
          date_valid = 'false';
        } else {
          date_valid = 'true';
        }

        res.status(200).send(
            {sessionInfo: {parameters: {date_valid: date_valid}}});
        break;

      // BEGIN lookupTransactions
      case 'lookupTransactions':
        console.log(tag + ' was triggered.');

        // select a random retailer from the retailers array
        let retailers = [
          'Dior', 'Walmart', 'Target', 'Costco', 'Macy\'s', 'Bed Bath & Beyond',
          'Amazon', 'Walgreens', 'Home Depot', 'Best Buy', 'Kohl\'s'
        ];
        let randomRetail = Math.floor(Math.random() * retailers.length);
        console.log('random retail value ' + randomRetail);

        let retailer_queried = retailers[randomRetail];

        // Alter the transaction amount
        let amount_queried =
            Number(req.body.sessionInfo.parameters.amount_queried.amount);
        let transaction_value = Number(amount_queried);
        let randomAdjust = Math.floor(Math.random() * 5);
        randomAdjust = Number(randomAdjust / 100);
        let adjustment = Number(amount_queried * randomAdjust);

        let randomMath = Math.floor(Math.random() * 1);
        if (randomMath < 1) {
          transaction_value = Number(transaction_value - adjustment).toFixed(2);
        } else if (randomMath = 1) {
          transaction_value = Number(transaction_value + adjustment).toFixed(2);
        }

        if (amount_queried < 1000) {
          transaction_found = 'true';
        } else {
          transaction_found = 'false';
        }

        res.status(200).send({
          sessionInfo: {
            parameters: {
              retailer_queried: retailer_queried,
              transaction_value: transaction_value,
              transaction_found: transaction_found
            }
          }
        });

        break;

      // BEGIN lookupCardFeatures
      case 'lookupCardFeatures':
        console.log(tag + ' was triggered.');

        // setup arrays for card features
        let interestRate = [
          '14.5% APR',
          '0% APR in year 1 and then increases to 25% APR in year 2',
          '10% APR in year 1 and then increases to 20% APR in year 2', '18% APR'
        ];
        let annualFee = [
          '$0 annual fee for year 1 and then increases to $90 in year 2',
          '$70 annual fee starting in year 1',
          '$15 annual fee for year 1 and then increases to $80 in year 2',
          '$50 annual fee starting in year 1'
        ];
        let cashBackRate = ['1%', '3%', '6%', '2%', '5%', '4%'];
        let pointsBonus = ['50,000', '25,000', '10,000', '100,000', '75,000'];

        // setup card one features
        let cardOneRandomInterest =
            Math.floor(Math.random() * interestRate.length);
        let card_one_interest = interestRate[cardOneRandomInterest];
        let cardOneRandomFee = Math.floor(Math.random() * annualFee.length);
        let card_one_fee = annualFee[cardOneRandomFee];
        let cardOneRandomCashback =
            Math.floor(Math.random() * cashBackRate.length);
        let card_one_cashback = cashBackRate[cardOneRandomCashback];
        let cardOneRandomPoints =
            Math.floor(Math.random() * pointsBonus.length);
        let card_one_points = pointsBonus[cardOneRandomPoints];

        // setup card two features
        let cardTwoRandomInterest =
            Math.floor(Math.random() * interestRate.length);
        let card_two_interest = interestRate[cardTwoRandomInterest];
        let cardTwoRandomFee = Math.floor(Math.random() * annualFee.length);
        let card_two_fee = annualFee[cardTwoRandomFee];
        let cardTwoRandomCashback =
            Math.floor(Math.random() * cashBackRate.length);
        let card_two_cashback = cashBackRate[cardTwoRandomCashback];
        let cardTwoRandomPoints =
            Math.floor(Math.random() * pointsBonus.length);
        let card_two_points = pointsBonus[cardTwoRandomPoints];

        res.status(200).send({
          sessionInfo: {
            parameters: {
              card_one_interest: card_one_interest,
              card_one_fee: card_one_fee,
              card_one_cashback: card_one_cashback,
              card_one_points: card_one_points,
              card_two_interest: card_two_interest,
              card_two_fee: card_two_fee,
              card_two_cashback: card_two_cashback,
              card_two_points: card_two_points
            }
          }
        });
        break;

      default:
        console.log('default case called');
        res.status(200).end();
        break;
    }
  }
};
               