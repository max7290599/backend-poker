If you haven't already, log in to your Heroku account and follow the prompts to create a new SSH public key.

$ heroku login
Clone the repository
Use Git to clone fast-escarpment-66573's source code to your local machine.

$ heroku git:clone -a fast-escarpment-66573
$ cd fast-escarpment-66573
Deploy your changes
Make some changes to the code you just cloned and deploy them to Heroku using Git.

$ git add .
$ git commit -am "make it better"
$ git push heroku master


**Create Game**
----

<details>

* **URL**

    /createGame

* **Method:**

    `POST`

* **Headers:**

    None

*  **URL Params**

    None

* **Query Params**

    None

* **Data Params**

 ```typescript
      {
        firstName: string,
        lastName: string,
        jobPosition: string,
        image: string,
      }
    ```

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** 
    ```json
      {
        "admin": {
        "firstName": "maxim",
        "image": "bas64",
        "jobPosition": "develop",
        "lastName": "Atroschenko"
        },
        "roomId": "dgbji",
        "users": {}
      }
    ```
 
* **Error Response:**

    None

* **Notes:**

    None


