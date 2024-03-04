const chai = require('chai')
const axios = require('axios');
const passwordHash = require('password-hash')
const pool = require('./config/db');

var expect = chai.expect;

const uri = `http://localhost:5002/quiz`
const authUri = 'http://localhost:5002/auth'

describe('Quiz', function () {

  let testUser
  let testUserToken
  let testQuizId

  before((done) => {
    const testUserData = {
      username: 'testUser',
      password: passwordHash.generate('testUserPassword'),
      accounttype: 'ADMIN'
    }
    const sql = `INSERT INTO users (username, password, accountType) VALUES ($1, $2, $3)`
    pool.query(sql, [testUserData.username, testUserData.password, testUserData.accounttype], async (err) => {
      if (err) {
        console.log(`Failed to create testUser due to error: ${err}`);
        return
      }
      console.log('created a test user account')
      try {
        const res = await axios({
          method: 'post',
          data: {
            username: 'testUser',
            password: 'testUserPassword'
          },
          url: `${authUri}/login`,
        })
  
        expect(res.status).to.equal(200)
        testUser = res.data
        testUserToken = res.headers['auth-token']
        done()
        
      } catch (err) {
        console.log(err)
        expect(err).to.be.undefined
      }
    });
  })

  describe('#create quiz', function () {
    it('should succesfully create a quiz', async function () {
      expect(testUser).to.not.be.undefined
      try {
        const res = await axios({
          method: 'post',
          data: {
            name: 'testQuiz(temporary)',
            description: 'testQuizDescription',
            questions: [
              {
                body: 'testQuestion',
                choices: ['testChoice1', 'testChoice2', 'testChoice3', 'testChoice4'],
                answerIndex: 3
              }
            ],
            userId: testUser.id 
          },
          url: `${uri}/create`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            'auth-token': testUserToken
          },
        })
        testQuizId = res.data.id
        console.log(res.data)
        expect(res.status).to.equal(200)
      } catch (err) {
        expect(err).to.be.undefined
        console.log(err)
      }
    });

    it('should fail to create quiz when validating quiz schema returns an error', async function () {
      try {
        const res = await axios({
          method: 'post',
          data: {
            name: 'testQuizShouldFail',
            description: 'testQuizDescription',
            questions: [
              {
                body: 'testQuestion',
                choices: ['testChoice1', 'testChoice2', 'testChoice3', 'testChoice4'],
                answerIndex: 3
              }
            ],
          },
          url: `${uri}/create`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            'auth-token': testUserToken
          },
        })

        expect(res.status).to.equal(400)
      } catch (err) {
        expect(err.response.status).to.equal(400)
      }
    });
  });

  describe('#get quizzes', function () {
    it('should succesfully return all quizzes stored in the database', async function () {
      try {
        const res = await axios({
          method: 'get',
          url: `${uri}/`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            "auth-token": testUserToken
          }
        })
        expect(res.status).to.equal(200)
        expect(res.data).to.not.be.undefined
      } catch (err) {
        expect(err).to.be.undefined
        console.log(err)
      }
    });

    it('should succesfully return a quiz by ID stored in the database', async function () {
      try {
        expect(testQuizId).to.not.be.undefined
        const res = await axios({
          method: 'get',
          url: `${uri}/${testQuizId}`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            "auth-token": testUserToken
          }
        })
        expect(res.status).to.equal(200)
        expect(res.data.name).to.equal('testQuiz(temporary)')
        } catch (err) {
          console.log(err)
        expect(err).to.be.undefined
      }
    });

    it('should fail to get quiz when ID doesn`t exist in the database', async function () {
      try {
        const res = await axios({
          method: 'get',
          url: `${uri}/1000000000000`, // ID that doesn`t exist
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            "auth-token": testUserToken
          }
        })
        expect(res.status).to.equal(400)
        } catch (err) {
        expect(err).to.not.be.undefined
      }
    });
  });

  describe('#update quiz', function () {
    it('should succesfully update quiz when all values are correct', async function () {
      try {
        const res = await axios({
          method: 'put',
          data: {
            name: 'Edited testQuiz(temporary)',
            description: 'testQuizDescription',
            questions: [
              {
                body: 'testQuestion',
                choices: ['testChoice1', 'testChoice2', 'testChoice3', 'testChoice4'],
                answerIndex: 3
              }
            ],
            userId: testUser.id 
          },
          url: `${uri}/edit/${testQuizId}`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            'auth-token': testUserToken
          },
        })
        expect(res.status).to.equal(200)
        expect(res.data).to.equal(testQuizId)
      } catch (err) {
        console.log(err)
        expect(err).to.be.undefined
      }
    });

    it('should fail to update quiz when validation returns an error', async function () {
      try {
        const res = await axios({
          method: 'put',
          data: {
            description: 'testQuizDescription',
            questions: [
              {
                body: 'testQuestion',
                choices: ['testChoice1', 'testChoice2', 'testChoice3', 'testChoice4'],
                answerIndex: 3
              }
            ],
            userId: testUser.id 
          },
          url: `${uri}/edit/${testQuizId}`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            'auth-token': testUserToken
          },
        })
        expect(res.status).to.equal(400)
      } catch (err) {
        expect(err).to.not.be.undefined
      }
    });

    it('should fail to update quiz when ID doesn`t exist in database', async function () {
      try {
        const res = await axios({
          method: 'put',
          data: {
            name: 'Edited testQuiz(temporary)',
            description: 'testQuizDescription',
            questions: [
              {
                body: 'testQuestion',
                choices: ['testChoice1', 'testChoice2', 'testChoice3', 'testChoice4'],
                answerIndex: 3
              }
            ],
            userId: testUser.id 
          },
          url: `${uri}/edit/1000000000`, // ID THAT DOESNT EXIST
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            'auth-token': testUserToken
          },
        })
        expect(res.status).to.equal(400)
      } catch (err) {
        expect(err).to.not.be.undefined
      }
    });
  });


  describe('#delete quiz', function () {
    it('should succesfully delete quiz from database',  async function () {
      try {
        const res = await axios({
          method: 'delete',
          data: {
            id: testQuizId
          },
          url: `${uri}/delete`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            'auth-token': testUserToken
          },
        })
        console.log(res.data)
        console.log(res.data)
        expect(res.status).to.equal(200)
        expect(res.data).to.equal('Quiz deleted')
        console.log(res.data)
      } catch (err) {
        expect(err).to.be.undefined
      }
    });

    it('should fail to delete quiz from database if ID doesn`t exist', async function () {
      try {
        const res = await axios({
          method: 'delete',
          data: {
            id: '1000000000000000000' // ID THAT DOESNT EXIST
          },
          url: `${uri}/delete`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            'auth-token': testUserToken
          },
        })
        expect(res.status).to.equal(400)
      } catch (err) {
        expect(err).to.not.be.undefined
      }
    });
  });

  after((done) => {
    pool.query("DELETE FROM users WHERE username='testUser'", (err) => {
      if (err) {
        console.log(`Failed to delete testUser due to error: ${err}`);
      }
      console.log('deleted the test user account')
      pool.query(`DELETE FROM quizzes WHERE id=${testQuizId}`, (err) => {
        if (err) {
          console.log(`Failed to delete testQuiz due to error: ${err}`);
        }
        console.log('Test quiz has been deleted')
        done();
      })
    });
  })
});