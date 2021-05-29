exports.forgotPasswordEmailContent = async (firstName, url) => {
  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Forgot Password . Zeek Xchange</title>
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
                <img width="125" src="/img/shield.svg" alt="" class="img-fluid header-img">
                <h1 class="title">Password Reset</h1>
            </header>
            <section class="container-fluid">
                <div class="content">
                    <h4>Dear ${firstName},</h4>

                    <p>You are receiving this email because you (or someone else) has initiated a request to change your
                        password. Please proceed to reset your password, or ignore this. This link expires in 30 minutes.
                    </p>

                    <a class="btn" href='${url}'>Proceed</a>
                </div>
            </section>
            <footer>
                <div class="container">
                    <h1 class="footer-header">Zeek Xchange</h1>
                    <div class="divider"></div>
                    <p>Email: <a href="mailto:info@ZeekXchange.com">info@ZeekXchange.com</a></p>
                    <p>This email is an important notice of a status change that may affect your account. Please read the
                        information carefully as actions, once taken, may be permanent</p>
                </div>
            </footer>
        </body>
    </html>`;
  return html;
};
