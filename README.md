## Team Members
```
Allen Shan
Allen Chiu
Ethan Esclamado
Bryan Perez

```

## Purpose of Project
```
Helping you find jobs and internships within the Georgia community that match your time, skills, and interests. Create and track your jobs and internships applications in one place.
Our team collaboratively designed, developed, and deployed this full-stack web application using React + Next.js, Node.js and MongoDB. Our application is a Athens/UGA Job, Internship or Opportunity Tracker. Users can search for jobs or paste a resume that will be parsed by a LLM (OpenAI Open-Source model hosted by Groq) that return ATS keywords relevant to the resume. Users can then click the keywords to query an API (Jsearch API from RapidAPI) with those keywords to find jobs relevant to their resume. Users can CREATE (add jobs returned by the API to the tracker), READ (read information about the jobs on the tracker), UPDATE (update job application information in the tracker), and DELETE (delete jobs from the tracker). 

```


## Tools Utilized
```
React, Node.js, Next.js, TypeScript, JavaScript, Authentication & Authorization, 

```

## Problems Encountered
```
Git
- Dealt with merge conflicts throughout the course of the weekend
- Worked together to sort out branches and correctly merge them into our main branch

Map overlaying
- The interactive map under the search tab would not be displayed on the screen properly when scrolling down (the map would still be seen over the navigation bar)
- The map would also be displayed over the page to upload resume
- Adjusted z-index variable to correct the overlaying issues

UI issues
- Updated layout, color scheme, and other front-end features to fit the UGA Hacks 11 magic theme
- Centered navigation bar buttons

Card layout

Database
- Had trouble setting up email verification to correctly be stored in the database
- Used MongoDB to store user data (email, password, temporary verification code when signing up)
```


## Public Frameworks
```
https://resend.com/features/email-api
https://wiki.openstreetmap.org/wiki/API
https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
https://console.groq.com/docs/model/openai/gpt-oss-20b

```


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
