# Online assesment - quiz application (SEA module)
A React Quiz App with ReactJS as front-end and NodeJS backend with PostgreSQL database, this document gives a brief overview on the application and what was used to make it. However some parts may not delve into great detail here, but this is due to them being elaborated further in the report! 

### *Background and context*
As a new joiner at Amazon, you are required to complete a series of trainings designed to assist you get familiar with the team's procedures, services, and systems.
These trainings cover a wide range of topics, from hands-on experience with new languages like Scala, which my team uses, to AWS trainings and more. The trainings often continue for about a month, which is a very lengthy onboarding process and may seem overwhelming due to the vast amount of information that must be digested. Also, not all of the content offered in trainings will directly impact and aid the job my team may undertake.

As a result, I decided to develop an online assessment application that allows existing team members to create quizzes that include content needed for operating within the team, all of which was included in the trainings, to assist the new joiner in feeling confident and knowing what is required to be known from the start, as the amount of information to take in is initially overwhelming. This new application allows us to create different assessments for different services we own and different topics, all of which will allow the user to see their score and revise the content they may have scored incorrectly on; however, none of the scores are stored because we do not want to place undue pressure on the user to know everything from the start. The team brought up this project during retrospective meetings in an effort to enhance the onboarding process and let new hires to self-evaluate their progress so far with all trainings completed.

# User Guide

### *Available app features for the user*
The two different access levels and their level of control + features
- Admin user - Take quizzes, create quizzes, edit quizzes(including questions and choices), view answers for questions within a quiz, delete quizzes, register a new user.
- Regular user (regarded as a COMMON user in the code) - Take quizzes, edit quizzes(including questions and choices), register a new user.

### *Pages*

- Login page - when the page is first loaded the user will be prompted to enter their login details in (username + password) to authenticate themselves, the password stored within the database is also hashed and salted using a library instead of storing it in plaintext for security purposes.
- Register page - if the user would like to register an account, they can press on register on the Login page in which they will be redirected to create a new account, the username however must be unique from others, in my team we have agreed to be using our aliases we are provided at work which is unique for each user.
- Home page - after logging in succesfully, the user will be greeted and shown a list of quizzes that have been created. Depending on access levels of the user as mentinoed above they will be shown a few different things but both are able to search for quizzes too with a search bar located at the top, this for when many quizzes have been created and for the usability too.
- Quiz page - when the button start is pressed for the quiz, you will be redirected to the quiz page in which you can then confirm to begin the quiz and begin answering away! Once all questions have been answered, the score will be shown at the end. (If the admin user is completing the assesment they can see the right answer using a view/hide button)
- Edit quiz page - Users may go through and edit a quiz to add/remove questions due to new content needing to be added or old content needing to be removed, we have made this feature open to regular users as we believe it would be good for new joiners to update this themselves to show their knowledge instead of relying on an existing team member.
- Create quiz page (admin only) - an admin can create a new quiz that can then be seen by all users to edit or complete.

### *Database design*

The database design can be seen in further detail in the report with the diagrams for further clarity.

Tables used can be seen below:
```
1. User
    id: ID! (PK)
    username: String
    password: String
    accountType: String
    createDate: Date

2. Quiz
    id: ID! (PK)
    name: String
    description: String
    createDate: Date
    UserID: User.id (FK)

3. Question
    id: ID! (PK)
    question: String
    answer: Int
    number: Int
    QuizID: Quiz.id (FK)

4. Choice
    id: ID! (PK)
    body: String
    choiceNumber: Int
    QuestionID: Question.id (FK)

```

### Framework
Using Express.js a backend application framework for building RESTful APIs with node.js, I created 8 APIs to help carry out the different functionalities;

```
1. /login - used for login

    Request
    {
        username: String,
        password: String
    }

    Response - None

2. /register - used for register of new users

    Request
    {
        username: String,
        password1: String,
        password2: String
    }

    Response - None

3. /get - used to get user ID after login

    Request
    {
        username: String,
        accountType: String,
    }

    Response
    {
        userId: ID!
    }

4. /getQuizzes - used to get all quizzes

    Response
    [
        {
            quizID: ID!
            name: String
            description: String 
            createDate: timestamp
        }
    ]

5. /create - used to create new quizzes (admin only)

    Request
    {
        name: String,
        description: String,
        userId: ID!
        {
            question: String
            answer: Int
            quizId: !ID
            number: Int
        },
            {
                body: String
                questionId: ID!
                number: Int
            }
    }

    Response
    {
        quizId: ID!
    }

6. /:id - used to find quiz by ID

    Request
    {
        quizId: ID!
    }

    Response
    {
        quizId: ID!
    } 

7. /edit/:id - used to edit existing quizzes

    Request
    {
        quizId: ID!
    }

    Response
    {
        name: String,
        description: String,
        userId: ID!
        {
            question: String
            answer: Int
            quizId: !ID
            number: Int
        },
            {
                body: String
                questionId: ID!
                number: Int
            }
    }

8. /delete - used to delete existing quizzes (admin only)

    Request
    {
        quizId: ID!
    }

    Response - None

```
 
 As demonstrated above, all APIs are used for either the user or for the quiz and utilise functions to split up the SQL commands that are being performed which are vast. For better modular code a lot of this was divided into functions for the quiz APIs due to the create and edit API sharing similarities which allowed re-use of code as opposed to duplicated code. These functions were then called more than once, demonstrating it served its purpose to remove the duplicated code lines that would've been in the create and edit API. Other smaller functions have been created to help break down code into smaller sections that can then be called later on instead of a single block.


### Dependencies
The dependencies have been illustrated in the first section of the report with the purpose of each and their benefits! A list of them can be seen below;
- PostgreSQL - database
- ExpressJs - framework used
- JsonWebToken - needed for framework
- Password-hash - hash password before being stored
- Cors - connect/express milddeware 
- Dotenv - loads environment variables into process.env
- Mocha - testing framework
- Joi - Object scheme validation
- Nodemon - helps develop apps by auto restarting the node application so changes are reflected live on screen without need of refreshing or running command again.

All dependencies can also be seen in the `package.json` file under `dependencies`.

## Project Structure 
###`react-quiz-backend` - backend package
####`src/routes`
This directory contains the definitions for all the different routes and API endpoints including both users and quiz.
####`src/config`
This directory contains the database config for the setup of the PostgreSQL database

####`test`
Contains the Mocha unit tests for quiz and users APIs.

###`react-quiz-frontend` - frontend package
####`src/api`
Contains all API endpoints from the backend, this serves as the connection for the APIs between frontend and backend.
####`src/components`
Contain all the React components created as well as page functionalities.
####`src/pages`
Contains all the different frontend pages.
####`src/styles`
Contains different styles used throughout such as colours.


### Technology Stack 
The technology stack includes: 
- JavaScript
- Node.js
- Express.js
- React 
- Bootstrap

#### Approval workflow process
Currently, there is no review or two-person rule to verify changes before they are tested. However, when I expose this application to my team in the future, I intend to require that all changes undergo a code review prior to deployment into a release pipeline. However, currently once changes are made to the github repository an automated deployment is performed with there consisting of 3 stages; build, test and deploy. In order for a change to flow through from build to deploy it must pass the tests ran in the testing stage.


### Code formatting
I used the code formatter Prettier to ensure correct syntax and indentation while ensuring the best coding style was followed throughout the implementation process. This also assisted me in identifying portions of code that could be refactored, allowing me to achieve modular code.


# Setup Instructions for locally hosting and running
##### AIM - Install node js, npm install, npm start

1. Firstly, ensure you have an IDE to open the code, I would recommend installing VSC (Visual Studio Code) if you do not have it already. This can be done here using this [URL](https://code.visualstudio.com/download).

2. Now having installed an IDE to open the project, please download the zip files of the project and open it up. (_One option is to open both files `react-quiz` and `react-quiz-server` in different windows so they are separate, this is due to both needing to be run on CLI, the BETTER option would be to open the parent folder `quiz-manager` and use split terminals which can be found at the top dropdown -> `Terminal -> Split Terminal`_)

3. On each of your two terminals displayed now, `cd` into each of them on the two; so run the following commands;

Run one on each of the terminals, not both!
```
cd react-quiz-backend
```

```
cd react-quiz-frontend
```

4. After please make sure you have node.js and npm installed, if not, node can be installed [here](https://nodejs.org/en/download) (please select your version and OS as well as the recommended one as opposed to the new one). 

    
    Once node.js has been installed, you can now navigate back to the split terminals and begin using npm. 
    
    To verify node was installed please enter `node-v` on one of the open terminals, you should now see the version, if not please refollow the steps to install node again. Please now run `npm install` on both open terminals which should install all the node modules needed and dependencies to your machine. If this fails try running `npm install -g express` or `npm update`.

5. After succesfully installing all node modules, the terminal may raise some vulnerabilites which is in regards to some node modules not using the latest version, these can be ignored! Please now go ahead and run `npm start` on the terminal in the filepath of `react-quiz-server` first to get the database and backend running followed by running `npm start` on the other terminal `react-quiz` to run the frontend. If unsure which terminal is in which repository, please run `pwd` which should tell you where you currently are for each of the terminals. 
e.g 
```
/Users/zkariy/Documents/quiz-manager/react-quiz-frontend
```

6. Once running a browser should open up of the page and application, login details can be found below. However if nothing opens, please navigate to this URL - `http://localhost:3000/`

### User details
Admin Account - this record was added as pre-configured data already, it isn't possible to register as an admin user, it will always be a regular account.
- Username: admin
- Password: admin

# Instructions on how to run unit tests
- Firstly, ensure that the package `react-quiz-backend` is running, to get it up and running please follow the above commands in setup instructions. From here open a new split terminal and cd into `react-quiz-backend`, so you should now have 2 terminals that are both in the same directory `react-quiz-backend`. One with the server running and one not, from here run the command `npm test` which will now run all the unit tests and will display the result of all cases.

e.g `15 passing` should be seen on the CLI after having run `npm test`.

Regular Account 
- Go ahead and register a new one for yourself!

### Common Issue
- `npm: command not found` - please ensure node.js is installed and if it already is, please re-install it on their [website](https://nodejs.org/en/download)