# BLOGGING API
This is an API for a blogging app

---

## Requirements
1. Users should have a first_name, last_name, email, password
2. A user should be able to sign up and sign in into the blog app
3. Use JWT as authentication strategy and expire the token after 1 hour
4. A blog can be in two states; draft and published
5. Logged in and not logged in users should be able to get a list of published blogs created
6. Logged in and not logged in users should be able to to get a published blog
7. Logged in users should be able to create a blog.
8. When a blog is created, it is in draft state
9. The owner of the blog should be able to update the state of the blog to published
10. The owner of a blog should be able to edit the blog in draft or published state
11. The owner of the blog should be able to delete the blog in draft or published state
12. The owner of the blog should be able to get a list of their blogs.
    * The endpoint should be paginated
    * It should be filterable by state
13. Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
14. The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated,
    * Default it to 20 blogs per page.
    * It should also be searchable by author, title and tags.
    * It should also be orderable by read_count, reading_time and timestamp
15. When a single blog is requested, the api should return the user information(the author) with the blog. The read_count of the blog too should be updated by 1
16. Come up with any algorithm for calculating the reading_time of the blog.
17. Write tests for all endpoints

---
## Setup
- Install NodeJS, mongodb
- pull this repo
- run `npm install` to install all dependencies
- update environment variables with *example.env* file
- run `npm run start`

---
## Base URL
- https://stark-oasis-55413.herokuapp.com/

## Models
---

### User
| field  |  data_type | constraints  |
|---|---|---|
|  first_name |  string |  required |
|  last_name |  string |  required |
|  email | string  |  required, unique|
|  password  |  string |  required  |


### Article
| field  |  data_type | constraints  |
|---|---|---|
|  title |  string |  required, unique |
|  description |  string |
|  state | string  |  enum: ['draft', 'published']|
|  tags |   [string] |    |
|  body |  string |  required |


## APIs
---
You can view the Postman API documentation <a href="https://documenter.getpostman.com/view/22961306/2s8YYFs47Y">HERE
---


## Contributor
- Kehinde Adedokun