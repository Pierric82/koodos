## Docker container build and setup instructions

For a full build process you will need node and npm, as well as docker.

1. build the app in the other folder (`react/`)
   a. set the `react/.env` file as needed based on `.env.sample`. Set up the URL the backend will be accessible from and the Giphy API key.
   b. run `npm install && npm run magic`

2. run `./prebuild.sh` in this folder; this will simply copy the necessary files from the `react/` folder to the `html/` subfolder

3. build the image, e.g. with
```bash
docker image build . -t koodos:testing
```

4. run the container, e.g. with
```bash
docker run -d --name koodos -p 80:8090 \
--volume /path/to/pocketbase-persistence:/pocketbase \
koodos:testing
```
Note that this container is based off Adrian Musante's Pocketbase container, so see other options on [his repo](https://github.com/adrianmusante/docker-pocketbase).
Keep in mind that this container however "hardcodes" Pocketbase migrations so that the table setup is always reset to what Koodos needs, so migrations won't be included in the peristence folder.

5. visit the backend, e.g. at `http://localhost/_/` (the `/_/` part is the admin portal for Pocketbase) and set up your admin account

6. set up the Google tokens in the Auth Providers section; set up your Google API console accordingly (follow Pocketbase instructions for this)

7. set up the URL of your app in the backend in the Application section

**ONLY NOW**, access the main app and sign in to test everything works.

If you try to sign in before the Google tokens and cloud settings are properly set up, you might end up in situations where you can't see
anything else than a loading screen. If that's the case, clear all application storage in the browser dev tools, fix the setup, then try again.
