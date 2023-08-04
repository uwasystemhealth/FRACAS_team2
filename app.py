from typing import List
from flask import Flask, render_template, redirect, url_for
from flask_mail import Mail, Message
from dotenv import load_dotenv
import os
from flask_executor import Executor

load_dotenv()

app = Flask(__name__)
app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER")
app.config["MAIL_PORT"] = os.getenv("MAIL_PORT")
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
app.config["MAIL_USE_TLS"] = False
app.config["MAIL_USE_SSL"] = True

mail = Mail(app)
executor = Executor(app)


def send_mail(subject: str, recipients: List[str], body: str) -> None:
    print("send message")
    msg = mail.send_message(
        subject,
        sender=app.config["MAIL_USERNAME"],
        recipients=recipients,
        body=body,
    )
    print(msg)


@app.route("/send-mail/")
def send_mail_page():
    executor.submit(
        send_mail,
        "Send Mail tutorial!",
        ["23195279@student.uwa.edu.au"],
        "Congratulations you've succeeded!",
    )
    return "<h1>Good job</h1>"
