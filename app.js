const inquirer = require("inquirer");
const fs = require("fs");
const generatePage = require("./src/page-template.js");

const promptUser = () => {
  return inquirer.prompt([
    // returns a promise
    {
      type: "input",
      name: "name",
      message: "What is your name?",
    },
    {
      type: "input",
      name: "github",
      message: "Enter your Github Username",
    },
    {
      type: "confirm",
      name: "confirmAbout",
      message:
        'Would you like to enter some information about yourself for an "About" section?',
      default: true,
    },
    {
      type: "input",
      name: "about",
      message: "Provide some information about yourself:",
      when: ({ confirmAbout }) => {
        if (confirmAbout) {
          return true;
        } else {
          return false;
        }
      },
    },
  ]);
};

const promptProject = (portfolioData) => {
  // if there is no projects array property, create one
  if (!portfolioData.projects) {
    portfolioData.projects = [];
  }

  console.log(`
    =================
    Add a New Project
    =================
    `);

  return inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of your project?",
      },
      {
        type: "input",
        name: "description",
        message: "Provide a description of the project (Required)",
      },
      {
        type: "checkbox",
        name: "languages",
        message: "What did you build the project with? (Check all that apply)",
        choices: [
          "JavaScript",
          "HTML",
          "CSS",
          "ES6",
          "jQuery",
          "Bootstrap",
          "Node",
        ],
      },
      {
        type: "input",
        name: "link",
        message: "Enter the GitHub link to your project. (Required)",
      },
      {
        type: "confirm",
        name: "feature",
        message: "Would you like to feature this project?",
        default: false,
      },
      {
        type: "confirm",
        name: "confirmAddProject",
        message: "Would you like to enter another project?",
        default: false,
      },
    ])
    .then((projectData) => {
      portfolioData.projects.push(projectData); // add project to the projects array
      if (projectData.confirmAddProject) {
        return promptProject(portfolioData); // recursive call if another project is needed
      } else {
        return portfolioData; // return data if no other projects
      }
    });
};

promptUser()
  // promise chain
  .then(promptProject)
  .then((portfolioData) => {
    const pageHTML = generatePage(portfolioData);

    fs.writeFile("index.html", pageHTML, (err) => {
      if (err) throw err;

      console.log(
        "Portfolio complete! Check out index.html to see the output!"
      );
    });
  });
