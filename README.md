# Music App Server

This REST API provides a  flexible backend for web-based music streaming applications. With this API,developers can easily access and manage music data to power their streaming services.This API provides the tools needed to deliver a seamless and engaging user experience.

## Getting Started

To get started with this API, you have two options: you can either run the application locally using yarn or use the provided Docker file. In either case, you'll need to obtain a `serviceKey.json` file for Firebase, which is used to store multimedia files such as images and audio files.

The `serviceKey.json` file is a private key file in JSON format that is used to authenticate a service account and authorize it to access Firebase services. To generate this file, go to the Firebase console and open **Settings > Service Accounts**. Then, click **Generate New Private Key** and confirm by clicking **Generate Key**. Make sure to securely store the JSON file containing the key.

This API uses MongoDB Atlas as its primary database and Redis Cloud for caching. Before using the API, make sure you have created accounts with both MongoDB Atlas and Redis Cloud and have set up your database and cache.

Once you have set up your MongoDB Atlas and Redis Cloud accounts, you can start using the API. For information about environment variables, refer to the `.env.example` file

### Running Locally

Clone the project

```bash
  git clone https://github.com/sm0483/music-app-server.git
```

Go to the project directory

```bash
  cd music-app-server
```

### Using Yarn

To run the application locally, first make sure you have npm installed. Then, navigate to the root directory of the project and run the following command:

```sh
yarn  && yarn run dev
```

This will install all necessary dependencies and start the application.

### Using Docker

You can run the application in a container using the provided Docker file. First, ensure that Docker is installed on your system. Then, navigate to the project’s root directory and execute the following command to build a Docker image for the application and run it in a container:

```sh
docker build -t music-api . && docker run -p 5000:5000 music-api
```

Alternatively, you can use `docker-compose` to start the application by running the following command:

```sh
docker-compose up
```

This will build a Docker image for the application and run it in a container.

## API Endpoints

This API provides several endpoints for accessing and managing music data. Below is a list of available endpoints and their descriptions.

### User

| Endpoint                            | Method  | Description                 |
| ----------------------------------- | ------- | --------------------------- |
| `/api/v1/artist/auth/register`      | `POST`  | Register a new artist       |
| `/api/v1/artist/auth/edit/password` | `PATCH` | Edit an artist's password   |
| `/api/v1/artist/auth/edit`          | `PATCH` | Edit artist information     |
| `/api/v1/artist/auth/login`         | `POST`  | Log in an artist            |
| `/api/v1/artist/`                   | `GET`   | Retrieve artist information |

`
&nbsp;

### Artist

| **Endpoint**                        | **Method** | **Description**                                       |
| ----------------------------------- | ---------- | ----------------------------------------------------- |
| `/api/v1/artist/auth/register`      | `POST`     | This endpoint is used to register a new artist.       |
| `/api/v1/artist/auth/edit`          | `PATCH`    | This endpoint is used to edit artist information.     |
| `/api/v1/artist/auth/edit/password` | `PATCH`    | This endpoint is used to edit an artist's password.   |
| `/api/v1/artist/auth/login`         | `POST`     | This endpoint is used to log in an artist.            |
| `/api/v1/artist/`                   | `GET`      | This endpoint is used to retrieve artist information. |

&nbsp;

### Album

| **Endpoint**                      | **Method** | **Description**                                                       |
| --------------------------------- | ---------- | --------------------------------------------------------------------- |
| `/api/v1/albums`                  | `POST`     | This endpoint is used to create a new album.                          |
| `/api/v1/albums`                  | `GET`      | This endpoint is used to retrieve a list of all albums.               |
| `/api/v1/albums/{album_id}`       | `GET`      | This endpoint is used to retrieve information about a specific album. |
| `/api/v1/albums/{album_id}`       | `PATCH`    | This endpoint is used to update information about a specific album.   |
| `/api/v1/albums/{album_id}`       | `DELETE`   | This endpoint is used to delete a specific album.                     |
| `/api/v1/albums/remove/{song_id}` | `PATCH`    | This endpoint is used to remove a specific song from an album.        |

&nbsp;

### Language

| **Endpoint**                      | **Method** | **Description**                                                          |
| --------------------------------- | ---------- | ------------------------------------------------------------------------ |
| `/api/v1/languages`               | `POST`     | This endpoint is used to create a new language.                          |
| `/api/v1/languages`               | `GET`      | This endpoint is used to retrieve a list of all languages.               |
| `/api/v1/languages/{language_id}` | `GET`      | This endpoint is used to retrieve information about a specific language. |

&nbsp;

### Genre

| Endpoint                    | Method | Description                        |
| --------------------------- | ------ | ---------------------------------- |
| `/api/v1/genres`            | `POST` | Create a new genre                 |
| `/api/v1/genres`            | `GET`  | Retrieve a list of genres          |
| `/api/v1/genres/{genre_id}` | `GET`  | Retrieve information about a genre |

&nbsp;`

### Song

| Endpoint                  | Method   | Description                       |
| ------------------------- | -------- | --------------------------------- |
| `/api/v1/songs`           | `POST`   | Create a new song                 |
| `/api/v1/songs/{song_id}` | `PATCH`  | Update song information           |
| `/api/v1/songs/{song_id}` | `DELETE` | Delete a song                     |
| `/api/v1/songs`           | `GET`    | Retrieve a list of songs          |
| `/api/v1/songs/{song_id}` | `GET`    | Retrieve information about a song |

&nbsp;

### PlayList

| Endpoint                             | Method   | Description                       |
| ------------------------------------ | -------- | --------------------------------- |
| `/api/v1/playlists`                  | `POST`   | Create a new song                 |
| `/api/v1/playlists/{playlist_id}`    | `PATCH`  | Update playlist information       |
| `/api/v1/playlists/{playlist_id}`    | `DELETE` | Delete a song                     |
| `/api/v1/playlists`                  | `GET`    | Retrieve a list of playlists      |
| `/api/v1/playlists/{playlist_id}`    | `GET`    | Retrieve information about a song |
| `/api/v1/playlists/remove/{song_id}` | `DELETE` | Remove a song from playlist       |

&nbsp;

### Search`

| Endpoint                 | Method | Description                                                                              |
| ------------------------ | ------ | ---------------------------------------------------------------------------------------- |
| `/api/v1/search/{query}` | `GET`  | Search for songs , playlists,song with language, song with genre or song with album name |

&nbsp;

### Songs - User Services

| Endpoint                                            | Method | Description                                     |
| --------------------------------------------------- | ------ | ----------------------------------------------- |
| `/api/v1/user-services/songs/like/{song_id}`        | `POST` | Like a song                                     |
| `/api/v1/user-services/songs/remove-like/{song_id}` | `POST` | Remove like from a song                         |
| `/api/v1/user-services/songs?count={count}`         | `GET`  | Retrieve a list of songs with a specified count |
| `/api/v1/user-services/liked`                       | `GET`  | Retrieve a list of liked songs                  |

&nbsp;
`

### Albums - User Services

| Endpoint                                              | Method | Description                                      |
| ----------------------------------------------------- | ------ | ------------------------------------------------ |
| `/api/v1/user-services/albums/like/{album_id}`        | `POST` | Like an album                                    |
| `/api/v1/user-services/albums/remove-like/{album_id}` | `POST` | Remove like from an album                        |
| `/api/v1/user-services/albums/{album_id}`             | `GET`  | Retrieve information about an album              |
| `/api/v1/user-services/albums?count={count}`          | `GET`  | Retrieve a list of albums with a specified count |

&nbsp;

### Artist Services

| Endpoint                             | Method | Description                              |
| ------------------------------------ | ------ | ---------------------------------------- |
| `/api/v1/artist-services/album-info` | `GET`  | Retrieve album information for an artist |

&nbsp;

## Examples

To facilitate the use of this API, a Postman collection has been created that includes examples for each endpoint. The collection can be accessed at the following link:

[API Postman Collection](https://documenter.getpostman.com/view/21080448/2s93RUvs48)
