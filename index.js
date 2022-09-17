const axios = require("axios");
const cheerio = require("cheerio");
const chalk = require("chalk");
// const { exec } = require("child_process");
var player = require("play-sound")((opts = {}));

const url = "https://rds2.northsouth.edu/index.php/common/showofferedcourses";
const course_data = [];

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
    if (course.course_name === course_name && 
        course.course_seats > 0) {
      searched_course_list.push(course);
    }
  });
  if (searched_course_list.length > 0) {
    chalk.red(console.log("COURSE IS AVAILABLE", course_name));
    player.play("./warning.wav", function (err) {
      console.log("Audio finished");
    });
    console.log(searched_course_list);
  } else {
    chalk.red(console.log("NO", course_name));
  }
}

async function searchCourseWithFaculty(course_name, course_faculty) {
  await getCourse();
  course_data.forEach((course) => {
    if (
      course.course_name === course_name &&
      course.course_faculty === course_faculty
    ) {
      searched_course_list.push(course);
    }
  });
  if (searched_course_list.length > 0) {
    chalk.red(console.log("COURSE IS AVAILABLE", course_name));
    player.play("./warning.wav", function (err) {
      console.log("Audio finished");
    });
    console.log(searched_course_list);
  } else {
    chalk.red(console.log("NO", course_name));
  }
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
      course.course_section === course_section
    ) {
      searched_course_list.push(course);
    }
  });
  if (searched_course_list.length > 0) {
    chalk.red(console.log("COURSE IS AVAILABLE", course_name));
    player.play("./warning.wav", function (err) {
      console.log("Audio finished");
    });
    console.log(searched_course_list);
  } else {
    chalk.red(console.log("NO", course_name));
  }
}
async function searchCourseWithSection(course_name, course_section) {
  await getCourse();
  course_data.forEach((course) => {
    if (
      course.course_name === course_name &&
      course.course_section === course_section
    ) {
      searched_course_list.push(course);
    }
  });
  if (searched_course_list.length > 0) {
    chalk.red(console.log("COURSE IS AVAILABLE", course_name));
    player.play("./warning.wav", function (err) {
      console.log("Audio finished");
    });
    console.log(searched_course_list);
  } else {
    chalk.red(console.log("NO", course_name));
  }
}
async function searchCourseWithFacultyAndAvailableSeats(
  course_name,
  course_faculty
) {
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
  if (searched_course_list.length > 0) {
    chalk.red(console.log("COURSE IS AVAILABLE", course_name));
    player.play("./warning.wav", function (err) {
      console.log("Audio finished");
    });
    console.log(searched_course_list);
  } else {
    chalk.red(console.log("NO", course_name));
  }
}

async function searchCourseWithFacultyAndAvailableSeatsAndSpecificSection(
  course_name,
  course_faculty,
  course_section
) {
  await getCourse();
  course_data.forEach((course) => {
    if (
      course.course_name === course_name &&
      course.course_faculty === course_faculty &&
      course.course_seats > 0 &&
      course.course_section === course_section
    ) {
      searched_course_list.push(course);
    }
  });
  if (searched_course_list.length > 0) {
    chalk.red(console.log("COURSE IS AVAILABLE", course_name));
    player.play("./warning.wav", function (err) {
      console.log("Audio finished ");
    });
    console.log(searched_course_list);
  } else {
    chalk.red(console.log("NO", course_name));
  }
}

var timer = setInterval(function () {
  searchCourseWithFacultyAndAvailableSeats("CSE299", "nbm");
  searchCourse("CSE373")
//   searchCourse("CSE225")
// searchCourseWithSection("MAT350","5");
}, 30000);
