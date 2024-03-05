const assert = require('assert');
const pool = require('./config/db');
const axios = require('axios');
const passwordHash = require('password-hash')
const chai = require('chai')

var expect = chai.expect;

const uri = `https://quiz-manager-three.vercel.app/auth`

describe('User', function () {

  before((done) => {
    const testUser = {
      username: 'testUser',
      password: passwordHash.generate('testUserPassword'),
      accounttype: 'ADMIN'
    }
    const sql = `INSERT INTO users (username, password, accountType) VALUES ($1, $2, $3)`;
    pool.query(sql, [testUser.username, testUser.password, testUser.accounttype], (err) => {
      if (err) {
        console.log(`Failed to create testUser due to error: ${err}`);
      }
      console.log('created a test user account')
      done();
    });
  })

  describe('#login', function () {
    it('should succesfully log the user in when user record exists in database', async function () {
      try {
        const res = await axios({
          method: 'post',
          data: {
            username: 'testUser',
            password: 'testUserPassword'
          },
          url: `${uri}/login`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8"
          },
        })
  
        expect(res.status).to.equal(200)
      } catch (err) {
        expect(err).to.be.undefined
      }
    });

    it('should fail to log the user in when user record doesn`t exist in database', async  function () {
      try {
        const res = await axios({
          method: 'post',
          data: {
            username: 'testUserThatDoesntExist',
            password: 'testUserPassword'
          },
          url: `${uri}/login`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8"
          },
        })
  
        expect(res.status).to.equal(400)
      } catch (err) {
        expect(err.response.status).to.equal(400)
      }
    });

    it('should fail to log the user in when password doesn`t match the one stored in the database', async function () {
      try {
        const res = await axios({
          method: 'post',
          data: {
            username: 'testUser',
            password: 'wrongPassword'
          },
          url: `${uri}/login`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8"
          },
        })
  
        expect(res.status).to.equal(400)
      } catch (err) {
        expect(err.response.status).to.equal(400)
      }
    });
  });

  describe('#register', function () {
    it('should succesfully register a user', async function () {
      try {
        const res = await axios({
          method: 'post',
          data: {
            username: 'newTestUser',
            password: 'newTestUserPassword'
          },
          url: `${uri}/register`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8"
          },
        })

        expect(res.status).to.equal(200)
        expect(res.data).to.have.property('username')
      } catch (error) {
        expect(error).to.be.undefined
      }
    });

    it('should fail to register a user due to username already existing', async function () {
      try {
        const res = await axios({
          method: 'post',
          data: {
            username: 'testUser',
            password: 'testUser'
          },
          url: `${uri}/register`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8"
          },
        })

        expect(res.status).to.equal(400)
      } catch (error) {
        expect(error.response.status).to.equal(400)
      }
      
    });
  });

  after((done) => {
    pool.query("DELETE FROM users WHERE username = ANY(ARRAY['testUser', 'newTestUser'])", (err) => {
      if (err) {
        console.log(`Failed to delete testUser due to error: ${err}`);
      }
      console.log('Test user account has been deleted')
      done();
    });
  })
});