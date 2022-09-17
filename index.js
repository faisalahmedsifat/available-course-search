const axios = require("axios");
const cheerio = require("cheerio");
const chalk = require("chalk");
var nodemailer = require("nodemailer");
require("dotenv").config();
var player = require("play-sound")((opts = {}));

const url = "https://rds2.northsouth.edu/index.php/common/showofferedcourses";
const course_data = [];

const sender_email = process.env.SENDER_EMAIL;
const sender_password = process.env.SENDER_APP_PASSWORD;
const reciever_email = process.env.RECIEVER_EMAIL;

var subject = "Course Available";
var send = true;

async function getCourse() {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const course = $("tr");
    course.each(function () {
      const course_name = $(this)
        .find("td")
        .eq(1)
        .text()
        .replace("\n", "")
        .replace(/\s+/g, "");
      const course_section = $(this)
        .find("td")
        .eq(2)
        .text()
        .replace("\n", "")
        .replace(/\s+/g, "");
      const course_faculty = $(this)
        .find("td")
        .eq(3)
        .text()
        .replace("\n", "")
        .replace(/\s+/g, "")
        .toLowerCase();
      const course_time = $(this)
        .find("td")
        .eq(4)
        .text()
        .replace("\n", "")
        .replace(/\s+/g, "");
      const course_room = $(this)
        .find("td")
        .eq(5)
        .text()
        .replace("\n", "")
        .replace(/\s+/g, "");
      const course_seats = $(this)
        .find("td")
        .eq(6)
        .text()
        .replace("\n", "")
        .replace(/\s+/g, "");
      course_data.push({
        course_name,
        course_section,
        course_faculty,
        course_time,
        course_room,
        course_seats,
      });
    });
  } catch (error) {
    console.error(error);
  }
}

const searched_course_list = [];

async function searchCourse(course_name) {
  await getCourse();
  course_data.forEach((course) => {
    if (course.course_name === course_name && course.course_seats > 0) {
      searched_course_list.push(course);
    }
  });
  doTheTasks(course_name, null, null);
}

async function searchCourseWithFaculty(course_name, course_faculty) {
  await getCourse();
  course_data.forEach((course) => {
    if (
      course.course_name === course_name &&
      course.course_faculty === course_faculty &&
      course.course_seats > 0
    ) {
      searched_course_list.push(course);
    }
  });
  doTheTasks(course_name, course_faculty, null);
}

async function searchCourseWithFacultyAndSection(
  course_name,
  course_faculty,
  course_section
) {
  await getCourse();
  course_data.forEach((course) => {
    if (
      course.course_name === course_name &&
      course.course_faculty === course_faculty &&
      course.course_section === course_section &&
      course.course_seats > 0
    ) {
      searched_course_list.push(course);
    }
  });

  doTheTasks(course_name, course_faculty, course_section);
}
async function searchCourseWithSection(course_name, course_section) {
  await getCourse();
  course_data.forEach((course) => {
    if (
      course.course_name === course_name &&
      course.course_section === course_section &&
      course.course_seats > 0
    ) {
      searched_course_list.push(course);
    }
  });
  doTheTasks(course_name, null, course_section);
}

function notifyWithEmail(subject, send) {
  if (send == true) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: sender_email,
        pass: sender_password,
      },
    });

    var mailOptions = {
      from: sender_email,
      to: reciever_email,
      subject: subject,
      text: "The desired course is available",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(chalk.red("Email sent: " + info.response));
      }
    });
    send = false;
  }
}

function doTheTasks(course_name, course_faculty, course_section) {
  if (course_faculty == null && course_section == null) {
    if (searched_course_list.length > 0) {
      console.log(chalk.blue("COURSE IS AVAILABLE", course_name));
      subject = "Course Available " + course_name;
      player.play("./warning.wav", function (err) {
        console.log("Audio finished ");
      });
      notifyWithEmail(subject, send);
      console.log(searched_course_list);
    } else {
      console.log(chalk.red("NO", course_name));
    }
  } else if (course_faculty != null && course_section == null) {
    if (searched_course_list.length > 0) {
      console.log(
        chalk.blue("COURSE IS AVAILABLE", course_name, course_faculty)
      );
      subject = "Course Available " + course_name + " " + course_faculty;
      player.play("./warning.wav", function (err) {
        console.log("Audio finished ");
      });
      notifyWithEmail(subject, send);
      console.log(searched_course_list);
    } else {
      console.log(chalk.red("NO", course_name, course_faculty));
    }
  } else if (course_faculty == null && course_section != null) {
    if (searched_course_list.length > 0) {
      console.log(
        chalk.blue("COURSE IS AVAILABLE", course_name, course_section)
      );
      subject = "Course Available " + course_name + " " + course_section;
      player.play("./warning.wav", function (err) {
        console.log("Audio finished ");
      });
      notifyWithEmail(subject, send);
      console.log(searched_course_list);
    } else {
      console.log(chalk.red("NO", course_name, course_section));
    }
  } else {
    if (searched_course_list.length > 0) {
      console.log(
        chalk.blue(
          "COURSE IS AVAILABLE",
          course_name,
          course_faculty,
          course_section
        )
      );
      subject =
        "Course Available " +
        course_name +
        " " +
        course_faculty +
        " " +
        course_section;
      player.play("./warning.wav", function (err) {
        console.log("Audio finished ");
      });
      notifyWithEmail(subject, send);
      console.log(searched_course_list);
    } else {
      console.log(chalk.red("NO", course_name, course_faculty, course_section));
    }
  }
}

// The only Change is needed here,
// You can add as many courses as you want
// Also add .env and add "SENDER_EMAIL" and "SENDER_APP_PASSWORD" and "RECIEVER_EMAIL" in .env file
// "SENDER_APP_PASSWORD" is the app password of your gmail account which you can get from here https://myaccount.google.com/apppasswords
// 300000 is the time in milliseconds after which the program will run again. It means the code will execute after every 5 minutes
// but the email will be sent only once when the course is available and the script is running

var timer = setInterval(function () {
  //   searchCourseWithFacultyAndAvailableSeats("CSE299", "nbm");
  searchCourseWithFaculty("CSE299", "nbm");
  //   searchCourse("CSE373");
  //   searchCourse("CSE225");
}, 300000);
