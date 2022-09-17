# available-course-search
Script to scrap the offered course list nsu, for personal use
This script will send you an email on successfully finding a seat.
This script is limited to sending only one email per execution (YOU CAN CHANGE IT HOWEVER YOU WANT)
The only changes needed:
1. At the last section of the code(below comments), specify the course, (faculty/section). This will search for the course and 
then play an alarm every time the code executes and finds the course as available(seats > 0)
2. To send the email, a .env file must be added. "SENDER_EMAIL", "SENDER_APP_PASSWORD", "RECIEVER_EMAIL" must be specified.

NOTE: "SENDER" must use 2step authentication, and generate an app password from https://myaccount.google.com/apppasswords.
