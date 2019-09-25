import firebase from 'firebase'

const config = {
    apiKey: "",
    authDomain: "host_name.firebaseapp.com",
    databaseURL: "https://host_name.firebaseio.com",
    projectId: "host_name",
    storageBucket: "host_name.appspot.com",
    messagingSenderId: "",
};

firebase.initializeApp(config);
export default firebase;