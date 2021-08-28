<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
***
***
***
*** To avoid retyping too much info. Do a search and replace for the following:
*** joshrw313, DCProject0821, twitter_handle, email, Express Boards, project_description
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<h1>Express Boards</h1>

   Backend project for Digital Crafts Full Stack Flex Week 16

A simple express.js application with html frontend to be viewed in a browser. Allows simple CRUD operations on a SQL database. Users can create an account or sign in with Google Oauth20 via passport.js. There are topic boards where users can create and read posts. Users can also leave comments on posts. 
    <br />
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

### Built With

* [Express](https://expressjs.com/)
* [Node.js](https://nodejs.org/en/)
* [Passport.js](http://www.passportjs.org/)
* [JSON Web Tokens](https://jwt.io/)
* [Sequalize](https://sequelize.org/)
* [PostgrSQL](https://www.postgresql.org/)



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/joshrw313/DCProject0821.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Install cookie-parser 
   ```sh
   npm install cookie-parser
   ```
4. Edit db.config.js to point at your SQL database 
   ```sh
   PREFEREDTEXTEDITOR app/config/db.config.js 
   ```
5. Create google.Oauth.js to contain your Oauth Credentials 
   ```sh
   PREFEREDTEXTEDITOR app/config/google.Oauth.js 
   ```
6. Deploy with the webserver of your choice
```sh
  cd app
  node server.js 
```

<!-- CONTACT -->
## Contact

Joshua White - joshrw313@gmail.com

Project Link: [https://github.com/joshrw313/DCProject0821](https://github.com/joshrw313/DCProject0821)

<!-- Contributors -->
## Contributors

Marsha Anderson - https://github.com/marsanderson

Wigensky Altidor - https://github.com/waltidor-06


<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

* [BezKoder](https://www.bezkoder.com/node-js-jwt-authentication-postgresql/)
* [DigitalCrafts](https://www.digitalcrafts.com/)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/joshrw313/repo.svg?style=for-the-badge
[contributors-url]: https://github.com/joshrw313/DCProject0821/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/joshrw313/repo.svg?style=for-the-badge
[forks-url]: https://github.com/joshrw313/DCProject0821/network/members
[stars-shield]: https://img.shields.io/github/stars/joshrw313/repo.svg?style=for-the-badge
[stars-url]: https://github.com/joshrw313/DCProject0821/stargazers
[issues-shield]: https://img.shields.io/github/issues/joshrw313/repo.svg?style=for-the-badge
[issues-url]: https://github.com/joshrw313/DCProject0821/issues
[license-shield]: https://img.shields.io/github/license/joshrw313/repo.svg?style=for-the-badge
[license-url]: https://github.com/joshrw313/DCProject0821/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/joshrw313
