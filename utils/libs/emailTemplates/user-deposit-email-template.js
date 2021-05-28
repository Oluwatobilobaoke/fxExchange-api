exports.registerEmailContent = async (
  firstName,
  amountInUsd,
  amountInBtc,
  addressSentTo,
  depositExpiryDate,
  link
) => {
  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Deposit . ZeekSwitch</title>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">

            <style>
                * {
                    font-family: 'Montserrat', sans-serif;
                }

                html {
                    background: #0A0911;
                }

                body {
                    background: #fbfbfb;
                }

                header {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background: rgba(255, 166, 0, 0.2);
                    padding: 30px;
                }

                .title {
                    text-align: center;
                }

                .content {
                    background: #ffffff;
                    box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.05);
                    /* box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23); */
                    border-radius: 5px;
                    padding: 10%;
                    margin-top: 20px;
                    margin-bottom: 20px;
                }

                .btn {
                    width: 160px;
                    padding-top: 15px;
                    padding-bottom: 15px;
                    color: #ffffff !important;
                    background: #FFA600;
                    text-decoration: none;
                }

                footer {
                    background: #0A0911;
                    color: #ffffff;
                    padding-top: 80px;
                    padding-bottom: 80px;
                }

                .divider {
                    height: 2.5px;
                    width: 100%;
                    background: #ffffff;
                    border-radius: 200px;
                    margin-top: 15px;
                    margin-bottom: 15px;
                }

                footer a {
                    text-decoration: none !important;
                    color: #ffffff !important;
                }

                @media screen and (min-width: 992px) {
                    section {
                        padding-left: 200px !important;
                        padding-right: 200px !important;
                    }
                }
            </style>
        </head>

        <body>
            <header>
                <img width="250" src="/img/deposit.svg" alt="" class="img-fluid header-img">
                <h1 class="title">Deposit</h1>
            </header>
            <section class="container-fluid">
                <div class="content">
                    <h4>Dear ${firstName},</h4>

                    <p>
                        You Just initiated a Sale of $${amountInUsd},
                        You are required to pay the equivalent of  ${amountInBtc} BTC
                        into this wallet <strong>${addressSentTo}</strong>, payment expires ${depositExpiryDate} 
                       <p> Click <a href="${link}">here</a> to pay <p>
                    </p>

                </div>
            </section>
            <footer>
                <div class="container">
                    <h1 class="footer-header">ZeekSwitch</h1>
                    <div class="divider"></div>
                    <p>Email: <a href="mailto:info@ZeekSwitch.com">info@ZeekSwitch.com</a></p>
                    <p>This email is an important notice of a status change that may affect your account. Please read the
                        information carefully as actions, once taken, may be permanent</p>
                </div>
            </footer>
        </body>
    </html>`;
  return html;
};
