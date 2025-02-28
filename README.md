## mynkie-edf

Display power usage.

(yes guess i should find a better name ...)

🔗 https://mynkie-edf.vercel.app

## About this mini-project

Based on a personal need, tracking my energy consumption. Although the energy provider's app could do the same thing, the fact that the app required me to log in every 3 days was annoying to me. So I did some researches and found an open-source API ([Conso API](https://conso.boris.sh/)). TYSM Boris !

## About how I retrieve data

Instead of making an API call every single time I visit the site, I only make it once a day and store it in [Vercel Edge Config](https://vercel.com/docs/storage/edge-config) data store the first time the site is visit that day, no matter who it is. From then on, the data displayed is fetched from Edge Config.

This help reduces requests, keeping the Conso API from getting overloaded (since it's open-source :D)

That's it !

## What I used

- Next
- Vercel Edge Config
- Shadcn library

@mynkie