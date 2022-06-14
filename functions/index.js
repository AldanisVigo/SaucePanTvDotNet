const functions = require("firebase-functions")
const admin = require("firebase-admin")
admin.initializeApp()
const { FieldValue } = require('@google-cloud/firestore')
const { firestore } = require("firebase-admin")

const freeAccountUploadLimit = 12

exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
    const uid = user.uid
    const email = user.email
    const displayName = user.displayName
    const verified = user.emailVerified
    const db = admin.firestore()
    const defaultProfileImage = "data:image/jpeg;base64,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"
    const defaultProfileBanner = "https://firebasestorage.googleapis.com/v0/b/trapppcloud.appspot.com/o/App%20Images%2Ffree%20purple%20banner.jpeg?alt=media&token=b07e056e-2b0e-4575-9747-bde7f1b47477"

    await db.doc('/users/' + uid).set({
        email : email,
        displayName : displayName,
        emailVerified : verified,
        limit : freeAccountUploadLimit,
        weekly_plays : 0,
        overall_plays : 0,
        profile_image : defaultProfileImage,
        profile_image_path : 'default',
        profile_banner : defaultProfileBanner,
        profile_banner_path : 'default'
    })
    console.log("Created a new user with email : " + email)
})


//Following mechanism
exports.onGotNewFollower = functions.firestore.document(`users/{uid}/followers/{newfollowerdoc}`).onCreate(async (snap,context)=>{
    const uid = context.params.uid
    //Increment number of followers by 1
    try{
        const userDocRef = admin.firestore().doc(`/users/${uid}`)
        await userDocRef.update({
            follower_count : FieldValue.increment(1)
        })
    }catch(err){
        console.error(err)
    }
})

exports.onLostFollower = functions.firestore.document(`users/{uid}/followers/{followerdoc}`).onDelete(async (snap,context)=>{
    const uid = context.params.uid

    try{
        const firestore = admin.firestore()
        const userDocRef = firestore.doc(`/users/${uid}`)
        
        //decrement the follower counter by one
        await userDocRef.update({
            follower_count : FieldValue.increment(-1)
        })

        // //Remove
        // firestore.doc('/users/' + uid).get().then(userSnap=>{
        //     firestore.collection("users/" + ownerid + '/followers').get().then(querySnapshot => {
        //         querySnapshot.forEach(async function(doc) {
        //             const currentFollowerId = doc.id
        //             firestore.collection('users').doc(currentFollowerId).collection('feed').get().then(feedSnapshot=>{
        //                 feedSnapshot.forEach(async function(feeddoc){
        //                     const feedItemId = feeddoc.id
        //                     if(feedItemId === snap.after.id){
        //                         await firestore.doc(feeddoc.ref.path).delete()
        //                     }
        //                 })
        //             })
        //         })
        //     })
        // })
    }catch{
        console.error(err)
    }
})

exports.onPlaylogUpdated = functions.firestore.document(`users/{uid}/playlog/{entryid}`).onCreate(async (snap, context) => {
    const uid = context.params.uid
    const entry_id = context.params.entryid
    
    //Calculate plays by ip address
    const playsbythisipdata = (await admin.firestore().doc('/users/' + uid + '/playsbyipcounter/' + snap.data().ip).get()).data()
    if(playsbythisipdata !== undefined){
        let playsbythisip = 0;
        if('count' in playsbythisipdata){
            playsbythisip = playsbythisipdata.count
        }
        let cnt = playsbythisip + 1
        await admin.firestore().doc('/users/' + uid + '/playsbyipcounter/' + snap.data().ip).update({
            count : cnt
        })

        //Add this song o the playlog entries collection within the playcount by ip log
        await admin.firestore().collection('/users/' + uid + '/playsbyipcounter/' + snap.data().ip + '/playlogentries/').add({
            playlog_entry_id : entry_id
        })

    }else{
        await admin.firestore().doc('/users/' + uid + '/playsbyipcounter/' + snap.data().ip).set({
            count : 1
        })

        //Add this song o the playlog entries collection within the playcount by ip log
        await admin.firestore().collection('/users/' + uid + '/playsbyipcounter/' + snap.data().ip + '/playlogentries/').add({
            playlog_entry_id : entry_id
        })
    }   

    //Recalculate the playcount and write it back into the song
})

// exports.scheduledFunction = functions.pubsub.schedule('every 5 minutes').onRun((context) => {
//     //EVERY 5 Minute Task Launcher
// })

// exports.scheduledFunction = functions.pubsub.schedule('every 30 minutes').onRun((context) => {
//     //EVERY 30 Minute Task Launcher
// })

// exports.scheduledFunction = functions.pubsub.schedule('every 1 hours').onRun((context) => {
//     //EVERY 1 hour Task Launcher
// })


exports.onSongUploaded = functions.storage.object().onFinalize(async (object)=>{
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const uid = filePath.split('/')[0]
    const contentType = object.contentType; // File content type.
    
    const upload_folder = filePath.split('/')[1]
    if(upload_folder == 'profile_image'){
        //Do some profile image resizing
        //Thumbnail generation
        //Check for inappropriate bullshit
        
    } else if(upload_folder == 'songs'){ //If the user is uploading a song
        // const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
        console.log("UID: " + uid + " just uploaded a file.")
        const firestore = admin.firestore()
        const userdata = (await firestore.collection("users").doc(uid).get()).data()
        if(userdata){
            console.log("Limit before upload: " + userdata.limit)
            console.log("Limit after upload: " + parseInt(userdata.limit) - 1)
            if(userdata.limit > 1){
                //Still in the limit, decrease limit by 1
                await firestore.collection('users').doc(uid).update({
                    limit : parseInt(userdata.limit) - 1
                })

                //Generate downloadURL
                var firstPartUrl = object.mediaLink.split("?")[0] // 'https://www.googleapis.com/download/storage/v1/b/abcbucket.appspot.com/o/songs%2Fsong1.mp3.mp3'
                var secondPartUrl = object.mediaLink.split("?")[1] // 'generation=123445678912345&alt=media'

                firstPartUrl = firstPartUrl.replace("https://www.googleapis.com/download/storage", "https://firebasestorage.googleapis.com")
                firstPartUrl = firstPartUrl.replace("v1", "v0")

                firstPartUrl += "?" + secondPartUrl.split("&")[1]; // 'alt=media'
                firstPartUrl += "&token=" + object.metadata.firebaseStorageDownloadTokens

                //Store it
                await firestore.collection('users').doc(uid).collection('songs').add({
                    name : filePath.split('/')[filePath.split('/').length - 1],
                    contentType : contentType,
                    fileBucket :  fileBucket,
                    storagePath : filePath,
                    downloadURL : firstPartUrl,
                    visibility : 'private',
                    coverUrl : 'https://firebasestorage.googleapis.com/v0/b/trapppcloud.appspot.com/o/App%20Images%2Fdefault_music_cover.webp?alt=media&token=28ef8400-8017-4ada-8291-d1f32b1b8209'
                })

            }else{
                //This is your last upload before pro plan
                await firestore.collection('users').doc(uid).update({
                    limit : 0
                })
                console.log("User has ran out of the free tier quota of 12 uploads. Pro plan email should be sent")
            }
        }else{
            console.log("No user data found")
        }
    }
})

//Notify followers when song visibility changes
exports.onSongVisibilityChanged = functions.firestore.document(`users/{owner}/songs/{songid}`).onUpdate(async (snap, context) => {
    const ownerid = context.params.owner
    let songData = snap.after.data()
    songData.type = 'song'
    songData.id = snap.after.id
    songData.ownerid = ownerid
    const firestore = admin.firestore()
    if(songData.visibility === 'public'){ //If the song was set to public, then put it in the follower's feed
        firestore.doc('/users/' + ownerid).get().then(userSnap=>{
            const ownerUsername = userSnap.data().username
            const backLink = "/profiles/" + ownerUsername
            songData.backLink = backLink
            firestore.collection("users/" + ownerid + '/followers').get().then(function(querySnapshot) {
                querySnapshot.forEach(async function(doc) {
                    const currentFollowerId = doc.id
                    await firestore.collection('users').doc(currentFollowerId).collection('feed').doc(snap.after.id).set(songData)
                })
            })
        })
    }
    
    if(songData.visibility === 'private'){
         firestore.doc('/users/' + ownerid).get().then(userSnap=>{
            firestore.collection("users/" + ownerid + '/followers').get().then(querySnapshot => {
                querySnapshot.forEach(async function(doc) {
                    const currentFollowerId = doc.id
                    firestore.collection('users').doc(currentFollowerId).collection('feed').get().then(feedSnapshot=>{
                        feedSnapshot.forEach(async function(feeddoc){
                            const feedItemId = feeddoc.id
                            if(feedItemId === snap.after.id){
                                await firestore.doc(feeddoc.ref.path).delete()
                            }
                        })
                    })
                })
            })
        })
    }
})


//Song Like Counter Listener
exports.onSongLikeCreatedCounter = functions.firestore.document(`users/{owner}/songs/{songid}/likers/{liker}`).onCreate(async (snap, context) => {
    const ownerid = context.params.owner
    const songid = context.params.songid
    // const likerid = context.params.liker

    //Count the number of likes
    const firestore = admin.firestore()
    const query = firestore.collection(`/users/${ownerid}/songs/${songid}/likers`)
    const snapshot = await query.get()
    const count = snapshot.size

    //Write them to the song document
    await firestore.doc('/users/' + ownerid + '/songs/' + songid).update({
        likes : count
    })
})

exports.onSongLikeDeletedCounter = functions.firestore.document(`users/{owner}/songs/{songid}/likers/{liker}`).onDelete(async (snap, context) => {
    const ownerid = context.params.owner
    const songid = context.params.songid
    // const likerid = context.params.liker

    //Count the number of likes
    const firestore = admin.firestore()
    const query = firestore.collection(`/users/${ownerid}/songs/${songid}/likers`)
    const snapshot = await query.get()
    const count = snapshot.size

    //Write them to the song document
    await firestore.doc('/users/' + ownerid + '/songs/' + songid).update({
        likes : count
    })
})


//Song Dislike Counter Listener
exports.onSongDislikeCreatedCounter = functions.firestore.document(`users/{owner}/songs/{songid}/dislikers/{disliker}`).onCreate(async (snap,context) => {
    const ownerid = context.params.owner
    const songid = context.params.songid
    // const dislikerid = context.params.disliker

    //Count the number of dislikes
    const firestore = admin.firestore()
    const query = firestore.collection(`/users/${ownerid}/songs/${songid}/dislikers`)
    const snapshot = await query.get()
    const count = snapshot.size

    //Write the count to the song document
    await firestore.doc('/users/' + ownerid + '/songs/' + songid).update({
        dislikes : count
    })
})

exports.onSongDislikeDeletedCounter = functions.firestore.document(`users/{owner}/songs/{songid}/dislikers/{disliker}`).onDelete(async (snap,context) => {
    const ownerid = context.params.owner
    const songid = context.params.songid
    // const dislikerid = context.params.disliker

    //Count the number of dislikes
    const firestore = admin.firestore()
    const query = firestore.collection(`/users/${ownerid}/songs/${songid}/dislikers`)
    const snapshot = await query.get()
    const count = snapshot.size

    //Write the count to the song document
    await firestore.doc('/users/' + ownerid + '/songs/' + songid).update({
        dislikes : count
    })
})