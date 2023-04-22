<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/LuonaMill/my-vinted-backend">
    <img src="vinted_logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Replica project : Vinted API</h3>

  <p align="center">
    My very first back-end project from zero, improved along my intensive training @ Le Reacteur Paris
 </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
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
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li> 
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Welcome to this API project !
I did not know what a backend could look like a few months ago, and I am so happy with this first project where I learned so much about server side, database, routes, and so on.
Thanks to this project, I can now run a full stack Vinted replica project for both web and mobile apps.
Please find my replicas for Vinted front-end projects here :

- Web project with React : https://github.com/LuonaMill/my-vinted-frontend
- Mobile project with React Native : https://github.com/LuonaMill/my-vinted-reactnative

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- Platform : Node.js
- Framework : Express
- Database : MongoDB
- Pictures upload & storage : Cloudinary
- Payment : Stripe

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To use this API you can request to the online API, hosted with Northflank :
https://site--backend-vinted--wbbmf4gr4bwy.code.run/

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Add your environment variables in a .env file with :

```
MONGODB_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SK_STRIPE=
PORT=
```

4. Start server
   ```sh
   npx nodemon
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Routes

### User

#### /user/signup (POST)

Create a new user

| Body       | Type   | Required |
| ---------- | ------ | -------- |
| `email`    | string | Yes      |
| `password` | string | Yes      |
| `username` | string | Yes      |
| `phone`    | string | No       |

<br>
<br>

#### /user/login (POST)

Log a user

| Body       | Type   | Required |
| ---------- | ------ | -------- |
| `email`    | string | Yes      |
| `password` | string | Yes      |

<br>
<br>

### Offer

#### /offers/ (GET)

Receive a list of offers.
Possibility to filter the results.

| Query      | Required | Description                                                                                                                                                                                                                                                 |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`    | No       | get a list of offers that contain `title`                                                                                                                                                                                                                   |
| `priceMin` | No       | get offers above `priceMin`                                                                                                                                                                                                                                 |
| `priceMax` | No       | get offers below `priceMax`                                                                                                                                                                                                                                 |
| `sort`     | No       | `date-asc` : get a list of offers sort by ascending dates <br> `date-desc`: get a list of offers sort by descending dates <br> `price-asc`: get a list of offers sort by ascending prices <br> `price-desc`: get a list of offers sort by descending prices |
| `page`     | No       | set the results page                                                                                                                                                                                                                                        |
| `limit`    | No       | set the limit of results                                                                                                                                                                                                                                    |

<br>
<br>

#### /offer/:id (GET)

Get an offer using its id

| Param | Required | Description |
| ----- | -------- | ----------- |
| `id`  | Yes      | offer id    |

<br>
<br>

#### /offer/publish (POST)

Create a new offer
| formData | Required | Description
| ------------- | -------- | -----------
| `title` | Yes | offer title
| `picture` | Yes | product picture
| `category` | Yes | product category
| `price` | Yes | product price
| `description` | No | product description
| `brand` | No | product brand
| `size` | No | product size
| `condition` | No | product condition
| `color` | No | offer color
| `city` | No | the city in which the offer is located

<br>

| Headers        | Required | Description |
| -------------- | -------- | ----------- |
| `Bearer token` | Yes      | user token  |

<br>
<br>

#### (not available yet) /offer/update/:id (PUT)

Update an offer

<br>
<br>

### (not available yet) /offer/delete/:id (DELETE)

Delete an offer

<br>
<br>

### Favorites

#### /favorites/:userId (GET)

Get identified user's favorites

| Param    | Required | Description |
| -------- | -------- | ----------- |
| `userId` | Yes      | user id     |

<br>
<br>

#### /favorites/:userId (PUT)

Add an article to favorite

| Body      | Required | Description |
| --------- | -------- | ----------- |
| `offerId` | Yes      | offer id    |
| `userId`  | Yes      | user id     |

<br>
<br>

#### /favorites/:userId (DELETE)

Delete an article from favorites

| Body      | Required | Description |
| --------- | -------- | ----------- |
| `offerId` | Yes      | offer id    |
| `userId`  | Yes      | user id     |

<br>
<br>

### Payment

#### /payment/ (POST)

Handle payments through Stripe

| Body          | Type   | Required |
| ------------- | ------ | -------- |
| `stripeToken` | string | Yes      |

<br>
<br>

<p align="right">(<a href="#readme-top">back to top</a>)</p>
