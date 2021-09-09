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
$ git push heroku main

**Create Game**
----

<details>

* **URL**

    /createGame

* **Method:**

    `POST`

* **Headers:**

    None

* **URL Params**

    None

* **Query Params**

    None

* **Data Params**

 ```typescript
      {
        firstName: string,
        SecondName: string,
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
        "SecondName": "Atroschenko"
        },
        "roomId": "gamer",
        "users": {}
      }
    ```

* **Error Response:**

    None

* **Notes:**

    None

**Connect Game**
----

<details>

* **URL**

    /connectGame

* **Method:**

    `POST`

* **Headers:**

    None

* **URL Params**

    None

* **Query Params**

    None

* **Data Params**

 ```typescript
      {
        roomId: string
      }
 ```

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:**

    ```
      {
        "OK"
      }
    ```

* **Error Response:**

    * **Code:** 406 Not Acceptable <br />
    **Content:**

    ```
      {
        "This game does not exist"
      }
    ```

* **Notes:**

    None


    **Socket.IO**
----

<details>

* **URL**

    'GAME:JOIN'

* **Method:**

    `emit`


* **Send Params**

 ```typescript
      {
        roomId: string,
        firstName: string,
        secondName: string, 
        jobPosition: string, 
        image: string,
        role: string
      }
 ```

* **Response:**

    'GAME:SET_USERS'

    * **Method:**

    `on`

    **Content:**

    ```json
[
  {
    "firstName": "Maksim",
    "image": "base64",
    "jobPosition": "dev",
    "role": "admin",
    "secondName": "Atroschenko"
  }
]
    ```
