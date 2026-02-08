## Purpose of Project
Helping you find jobs and internships within the Georgia community that match your time, skills, and interests. Create and track your jobs and internships applications in one place.
Our team collaboratively designed, developed, and deployed this full-stack web application using React + Next.js, Node.js and MongoDB. Our application is a Athens/UGA Job, Internship or Opportunity Tracker. Users can search for jobs or paste a resume that will be parsed by a LLM (OpenAI Open-Source model hosted by Groq) that return ATS keywords relevant to the resume. Users can then click the keywords to query an API (Jsearch API from RapidAPI) with those keywords to find jobs relevant to their resume. Users can CREATE (add jobs returned by the API to the tracker), READ (read information about the jobs on the tracker), UPDATE (update job application information in the tracker), and DELETE (delete jobs from the tracker). 


## Tools Utilized
React, Node.js, Next.js, TypeScript, JavaScript, Authentication & Authorization, 


## Problems Encountered
Git
- Dealt with merge conflicts with differing development branches throughout the course of the weekend
- Worked together to sort out branches and correctly merge them into our main branch

Map overlaying
- The interactive map under the search tab would not be displayed on the screen properly when scrolling down (the map would still be seen over the navigation bar)
- The map would also be displayed over the upload resume modal 
- Adressed this bug/issue by adjusting the z-index variable to push the map back and to correct the overlaying issue

UI issues
- Encountered the navbar, footer, and buttons within divs not centering or aligning properly
- Addressed by adjusting Tailwind classes so that it centered navigation bar, footer, and buttons across the web application
- Updated layout, color scheme, and other front-end features to fit the UGA Hacks 11 magic theme

Card layout
- Had some issues using the map function in Javascript to list the cards that contain the jobs returned by the JSearch API. Initially the card list was verticaly. 
- Addressed by adding the cards into rows AND columns so that the job cards span properly across the website.
- Had some issue formatting the card (initially the card had to much information, some information was cut out to simplify)

Database
- Had trouble setting up email verification to correctly be stored in the database
- Used MongoDB to store user data (email, password, temporary verification code when signing up)

API limitations
- Some of the API's where quite janky and unreliable and some API's came with strict call/usage limitations
- Addressed those issues by rotating API keys to maintain access to APIs and used API calls with information returned to keep it reliable.

## Team Members
Allen Chiu
Allen Shan
Ethan Esclamado
Bryan Perez




## Public Frameworks
- https://resend.com/features/email-api
- https://wiki.openstreetmap.org/wiki/API
- https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
- https://console.groq.com/docs/model/openai/gpt-oss-20b


## Run these commands in terminal
```
install mongodb mongoose
npm install react@rc react-dom@rc leaflet
npm install react-leaflet@next
npm install -D @types/leaflet
npm install leaflet.markercluster

```
  
## Run the development server

```
cd athens-uga-opportunity-tracker
npm run dev
```
