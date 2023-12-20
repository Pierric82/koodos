# Koodos

A simple React application to make boards of friendly messages with GIFs.

(Not unlike another website you might know)

### What is this?
It's the output of a learning exercise, that happened in 2 phases. Some time ago I learned React and Firebase, and produced a serverless first version running on Firebase DB and cloud functions.
Recently I switched over to PocketBase, which I was curious about, and turned this into a self-hosted app, the backend of which is simply PocketBase. It's also PocketBase that hosts the frontend application in the Docker version I facilitate.

### Where's this at?
Hmm... pre-alpha, clearly?

Things that should happen:
- the code would still need to be cleaned up and refactored in many places
- a few key features are still missing, such as editing the name of an existing board
- refactoring of the Docker building process, it can be much simpler
- the package.json file is a bit broken and would need cleanup - but it should work

Proceed with caution, but have fun.

### How to run it?
If you have the prerequisites like docker and node, you can try the instructions in the `docker/` folder.
Alternatively you can build the react app and run it locally, but you'll need to jump through more hoops to set up PocketBase.
