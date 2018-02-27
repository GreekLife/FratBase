
//-----Dependencies-----//
var FCM = require('fcm-push');
var firebase = require('firebase');
var apn = require('apn');

//-----Connect to Android-----//
var androidServerKey = 'AAAAnM9NExs:APA91bGvq70XEEDVAKBkp3MA99D88pISL3OITfDh6Us9_rjLla2eNW589iKGORHs8EEZn_IFq4QFJrBFqUvs4vHv9A8ugZsjvqGSrfdrQAc0v1Kb_hmY19AR8VqXxjD39kDbXcFSfZ-a';
var fcm = new FCM(androidServerKey);
//-----Connect to iOS-----//
 var options = {
    token: {
          pfx: "Certificate.p12",
      key: "AuthKey_XCVK62CSQF.p8",
      keyId: "XCVK62CSQF",
      teamId: "ASQJ3L7765"
    },
    pfx: "Certificate.p12",
    production: true,      // gateway address
   };
var apnProvider = new apn.Provider(options);

//-----Connect to Firebase-----//
//Firebase connection
var config = {
    apiKey: "AIzaSyDoOWPGkVYOx0dUZu8USGJGW00FAAyMwCk",
    authDomain: "greek-life-ios.firebaseapp.com",
    databaseURL: "https://greek-life-ios.firebaseio.com/"
};
firebase.initializeApp(config);

//-----Notification functions-----//

//Android notification
function SendAndroidNotification(token, title, body, payload){
    var message = {
        to: token, // required fill with device token or topics
        notification: {
            title: title,
            body: body
        },
        data: {
            value: payload
        }
    };
    if(token != null && token.length > 6) {
        var subToken = token.substring(0, 6);
    }
    fcm.send(message)
        .then(function(response){
            console.log("Succesfully sent message to ", subToken);
            console.log(response);
        })
        .catch(function(error) {
            console.log("Something has gone wrong sending to ", subToken);
            console.log(error);
        })
}

//IOS notif function
function SendIOSNotification(token, message, sound, payload, badge){
var deviceToken = token; //phone notification id
var notification = new apn.Notification(); //prepare notif
notification.topic = 'com.GL.Greek-Life'; // Specify your iOS app's Bundle ID (accessible within the project editor)
notification.expiry = Math.floor(Date.now() / 1000) + 3600; // Set expiration to 1 hour from now (in case device is offline)
notification.badge = badge; //selected badge
notification.sound = sound; //sound is configurable
notification.alert = message; //supports emoticon codes
notification.payload = {id: payload}; // Send any extra payload data with the notification which will be accessible to your app in didReceiveRemoteNotification
    apnProvider.send(notification, deviceToken).then(function(result) {  //send actual notifcation
    // Check the result for any failed devices
    console.log(result);
    var subToken = token.substring(0, 6);
    console.log("Succesfully sent message to ", subToken);
    }).catch( function (error) {
            console.log("Faled to send message to ", subToken);
    })
}


//----Running on date -----//
var d = new Date();
console.log(d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear());


//-----Global Ids-----//
var MasterId = "";
var Subscribers = [];
var DatabaseNode = "GammaLambda"; //current DB node

var notifRef = firebase.database().ref(DatabaseNode+"/NotificationIds");
    notifRef.on('value', snapshot => { 
        Subscribers = [];
        getIds();
});
                  

function getIds() {
    console.log("Reprocessing NotificationId...")
    //-----Get IOS Subscribers-----// +
    var iosRef = firebase.database().ref(DatabaseNode+"/NotificationIds/IOS");
    iosRef.once('value', snapshot => {
            console.log("IOS");
        snapshot.forEach(snapshot => {

           var idStored = {
               NotificationId: snapshot.child("Id").val(),
               Id: snapshot.child("UserId").val(),
               Type: "IOS",
               Name: snapshot.child("Username").val()
            }; 
            if(Subscribers.indexOf(idStored) < 0) {
                Subscribers.push(idStored);
            }
            console.log(snapshot.child("Id").val());
        }); 
    });

    //-----Get Android Subscribers-----// +
    var androidRef = firebase.database().ref(DatabaseNode+"/NotificationIds/Android");
    androidRef.once('value', snapshot => {
            console.log("Android");
       snapshot.forEach(snapshot => {

           var idStored = {
               NotificationId: snapshot.child("Id").val(),
               Id: snapshot.child("UserId").val(),
               Type: "Android",
               Name: snapshot.child("Username").val()
            }; 
           if(Subscribers.indexOf(idStored) < 0) {
                Subscribers.push(idStored);
            }  
          console.log(snapshot.child("Id").val());  
       }); 
    });
}

//-----Get Master Id and notify master for new users-----// +
var UserIds = [];
var FirstRoundNewUser = true;
var idRef = firebase.database().ref(DatabaseNode+"/Users");
idRef.on('value', snapshot => {
    
if(FirstRoundNewUser) {
     snapshot.forEach(snapshot => {
        UserIds.push(snapshot.key);
      if(snapshot.child("Position").val() == "Master") {
          MasterId = snapshot.child("UserID").val();
        }                                                               
     });   
}
if (!FirstRoundNewUser) {
    UserIds.forEach(id =>{
            if(UserIds.indexOf(id) < 0) {
                //user doesnt already exist -> new user
                Subscribers.forEach(user => {
                    if(user.UserID == MasterId) {
                        if(user.Type == "IOS") {
                           SendIOSNotification(MasterNotificationID, "You have a new user!", 'ping.aiff', 1, 3 );
                        }
                        else if (user.Type == "Android") {
                          SendAndroidNotification(MasterNotificationID, "You have a new user!","");

                        }
                    }
                    UserIds.push(id);
                });
            }
    });
}
    console.log("User Ids");
    console.log(UserIds);
    FirstRoundNewUser = false;
});

//-----New News on home page-----// +
var NewsArray = [];
var FirstRoundNews = true;
var newsRef = firebase.database().ref(DatabaseNode+"/News");
newsRef.on('value', snapshot => {
    snapshot.forEach(snapshot => {
        if(FirstRoundNews) {
             NewsArray.push(snapshot.key);
            }
        else {
            if(NewsArray.indexOf(snapshot.key) < 0) {
                //news is new
                NewsArray.push(snapshot.key);
                console.log("Sending for News...");
                Subscribers.forEach(user => {
                   if(user.Type == "IOS") {
                    SendIOSNotification(user.NotificationId, "There is a new post on the home page!", 'ping.aiff', 1, 3 );
                   } 
                    else if(user.Type == "Android") {
                    SendAndroidNotification(user.NotificationId, "There is a new post on the home page!" ,"");
                    }
                });
            }
        }
    });
    FirstRoundNews = false;

});

//-----Custom Master Notification-----// +
var FirstRoundMaster = true;
var masterRef = firebase.database().ref(DatabaseNode+"/GeneralMessage/Master");
masterRef.on('value', snapshot => {
    if(!FirstRoundMaster) {
        if(snapshot.val() != "") {
      console.log("Sending for custom Master...");
      Subscribers.forEach(user => {
        if(user.Type == "IOS") {
            SendIOSNotification(user.NotificationId, "Master:"+snapshot.val(), 'ping.aiff', 1, 3 );
        } 
        else if(user.Type == "Android") {
            SendAndroidNotification(user.NotificationId, "Master:"+snapshot.val(),"");
        }
      });
     }
    }
    FirstRoundMaster = false;
});

//-----Custom App Notification-----// +
var FirstRoundApp = true; //skip over the first read
var appRef = firebase.database().ref(DatabaseNode+"/GeneralMessage/Message");
appRef.on('value', snapshot => {
    if(!FirstRoundApp) {
       console.log("Sending for custom message...");
        Subscribers.forEach(user => {
         if(user.Type == "IOS") {
            SendIOSNotification(user.NotificationId, "FratBase:"+snapshot.val(), 'ping.aiff', 1, 3 );
        } 
        else if(user.Type == "Android") {
            SendAndroidNotification(user.NotificationId, "FratBase:" + snapshot.val(),"");
        }
        });
      }
    FirstRoundApp = false;
});

//-----New Forum Post-----// +
var FirstRoundForum = true; //skip over the first read
var forumRef = firebase.database().ref(DatabaseNode+"/Forum/ForumIds");
forumRef.on('value', function(snapshot) {
    if(!FirstRoundForum) {
     console.log("Sending for new post...");
     Subscribers.forEach(user => {
        if(user.Type == "IOS") {
            SendIOSNotification(user.NotificationId, "A new Post has been added to the Forum!", 'ping.aiff', 1, 3 );
        } 
        else if(user.Type == "Android") {
            SendAndroidNotification(user.NotificationId, "A new Post has been added to the Forum!","");
        }
      });
    }
    FirstRoundForum = false;
});

//----Notify every 3 hours to check post ------//
checkGotIt();
setInterval(checkGotIt, 10800000);
function checkGotIt() {
    
    var GotItRef = firebase.database().ref(DatabaseNode+"/Forum");
    GotItRef.once('value', snapshot => { 
        var hasntVoted = [];

        snapshot.forEach(snap => {
          if(snap.key != "ForumIds") {
            var gotItArray = snap.child("GotIt");
            
            if(gotItArray != null) {
                var hasVoted = [];
                gotItArray.forEach(person => {
                      hasVoted.push(person.key);
                }); 
                
              Subscribers.forEach(user => {
        
                if(hasVoted.indexOf(user.Id) < 0) {
                    if(hasntVoted.indexOf(user) < 0) {
                        hasntVoted.push(user);
                    }
                }
            
            });  
            }          
            }
        });
                        
        hasntVoted.forEach(user => {
          try {
            if(user.Type == "IOS") {
            SendIOSNotification(user.NotificationId, "You have unread posts. Let everyone know you saw it with the \"Got It!\" button.", 'ping.aiff', 1, 3 );
            } 
            else if(user.Type == "Android") {
            SendAndroidNotification(user.NotificationId, "You have unread posts. Let everyone know you saw it with the \"Got It!\" button.","");
            }
          }
          catch(error) {

          }

        });

    });
}

//-----New Poll-----// +
var FirstRoundPoll = true; //skip over the first read
var pollRef = firebase.database().ref(DatabaseNode+"/Polls/PollIds");
pollRef.on('value', snapshot => {
    if(!FirstRoundPoll) {
     console.log("Sending for new Poll...");
      Subscribers.forEach(user => {
        if(user.Type == "IOS") {
            SendIOSNotification(user.NotificationId, "A new Poll has been added", 'ping.aiff', 1, 3 );
        } 
        else if(user.Type == "Android") {
            SendAndroidNotification(user.NotificationId, "A new Poll has been added","");
        }
      });
    }
    FirstRoundPoll = false;
});


//-----Check who hasnt answered an existing poll-----// -
//--Check every 3 hours --//
CheckForUnansweredPolls();
setInterval(CheckForUnansweredPolls, 10800000);

function CheckForUnansweredPolls() {
 var hasntAnsweredAPoll = [];
 var pollOpRef = firebase.database().ref(DatabaseNode+"/PollOptions");
   pollOpRef.once('value', snapshot => {

    var arrayOfNonVoters = [];

       snapshot.forEach(snapshot => {

           var arrayOfVoters = [];
           var ids = snapshot.child("\"0\"").child("Names");
               ids.forEach(id => {
               arrayOfVoters.push(id.key);
               });
           console.log("voters:" + arrayOfVoters);
           Subscribers.forEach(user => {

            if(arrayOfVoters.indexOf(user.Id) < 0) {
              if(arrayOfNonVoters.indexOf(user) < 0){
                 arrayOfNonVoters.push(user);
              }
            }

           });
       });
       arrayOfNonVoters.forEach(idStored => {
                   if(idStored.Type == "IOS") {
                       SendIOSNotification(idStored.NotificationId, "There are existing polls you haven't answered yet", 'ping.aiff', 1, 3 );
                   } 
                   else if(idStored.Type == "Android") {
                       SendAndroidNotification(idStored.NotificationId, "There are existing polls you haven't answered yet","");
                   }
          });

   });
}

//-----Comments on forum posts you're subscribed to-----//

//---You have a new channel ----//

//-----Upcomming events-----//

//-----New Calendar Event-----// +
var Events = [];
var FirstRoundCalendar = true; //skip over the first read
var calendarRef = firebase.database().ref(DatabaseNode+"/Calendar");
calendarRef.on('value', snapshot => {
    if(FirstRoundCalendar) {
        snapshot.forEach(snapshot => {
            Events.push(snapshot.key);
        });
    }
    if(!FirstRoundCalendar) {
        snapshot.forEach(snapshot => {
            if(Events.indexOf(snapshot.key) < 0) {
                Events.push(snapshot.key);
                 console.log("Sending for new Event...");
                 Subscribers.forEach(user => {
                    if(user.Type == "IOS") {
                        SendIOSNotification(user.NotificationId, "A new event has been added", 'ping.aiff', 1, 3 );
                    } 
                    else if(user.Type == "Android") {
                        SendAndroidNotification(user.NotificationId, "A new event has been added","");
                    }
                  });
            }
        }); 
    }
        FirstRoundCalendar = false;
});
   
//-----Direct Dialogues you're already subscribed to-----//
var listOfDialogues = [];
var dialogueRef = firebase.database().ref(DatabaseNode+"/DirectDialogues");
dialogueRef.once('value', snapshot => {
    listOfDialogues = [];
    console.log("Reprocessing Dialogues");
    snapshot.forEach(dialogue => {
        
     var messengeesString = dialogue.key;
     var messengees = messengeesString.split(", ");
     var subs = {
       id: messengeesString,     
       messengeeOne: messengees[0],
       messengeeTwo: messengees[1]
     };

        listOfDialogues.push(subs);
    });
    setDialogueObservers();
    
});
var listOfDialogueObservers = [];
function setDialogueObservers(){
    
    if(listOfDialogueObservers != null) {
        ExistingObservers.forEach(ref => {
           ref.off(); 
        });
    }
  var count = listOfDialogues.length;
  listOfDialogues.forEach(channel => {
        var ref = firebase.database().ref(DatabaseNode+"/DirectDialogues/"+channel.id+"/Messages");
        listOfDialogueObservers.push(ref);
        ref.on('value', snapshot => {
         if(count <= 0) {    
            var messages = []
            console.log("Processiing specific dialogue change for :"+channel.id);
            snapshot.forEach(message => {
               var messageObj = {
                   nameAndTime: message.key,
                   mes: message.val()
               };
            messages.push(messageObj);    
            });
            
            var lastMessage = messages[messages.length - 1];
            var sender = (lastMessage.nameAndTime.split(", "))[1];
            var reciever = "";
            var message = lastMessage.mes;
            console.log("1:"+channel.messengeeOne + " 2:"+channel.messengeeTwo);
            if(channel.messengeeOne == sender) {
                reciever = channel.messengeeTwo;
            }
            else {
                reciever = channel.messengeeOne;
            }
            console.log("Sender:" + sender +"|");
            console.log("Reciever:" + reciever+"|");
            console.log(reciever);
            Subscribers.forEach(subscriber => {
                if(subscriber.Id == reciever) {
                    var senderName = "";
                       Subscribers.forEach(sub => {
                        if(sub.Id == sender) {
                          senderName = sub.Name;
                          console.log(senderName);
                        }
                       });
                 if(subscriber.Type == "IOS") {
                        var croppedMessage = message;
                       if (message.length > 50) {
                           croppedMessage = message.substring(0, 50);
                           croppedMessage = croppedMessage + "...";
                       }

                        SendIOSNotification(subscriber.NotificationId, senderName +"\n "+croppedMessage , 'ping.aiff', "DDM"+sender, 3 );
                    } 
                    else if(subscriber.Type == "Android") {
                        var croppedMessage = message;
                        if (message.length > 30) {
                           croppedMessage = message.substring(0, 30);
                           croppedMessage = croppedMessage + "...";
                       }
                        SendAndroidNotification(subscriber.NotificationId, sender, croppedMessage, "DDM"+sender);
                    }
                } 
            });
         }
            count--;
        });      
   });
} 

//-----Channels you're already subscribed to-----// +++
var listOfChannels = [];
var channelRef = firebase.database().ref(DatabaseNode+"/ChannelDialogues");
channelRef.on('value', snapshot => {
        listOfChannels = [];
        console.log("Reprocessing channels");
        snapshot.forEach(channel => {
            
           var messengeesStr = channel.child("Messengees").val();
            if(messengeesStr == null) {
                messengeesStr = "";
            }
           var messengees = messengeesStr.split(", ");
           var channelName = channel.child("Name").val();
            var ChannelData =  {
                Subs: messengees,
                Name: channelName,
                id: channel.key
            };
                listOfChannels.push(ChannelData);
        });
            
            setChannelObservers();
    
    });
var ExistingObservers = [];
function setChannelObservers() {
    
    if(ExistingObservers != null) {
        ExistingObservers.forEach(ref => {
           ref.off(); 
        });
    }

    var count = listOfChannels.length;
    listOfChannels.forEach(channel => {
       var ref = firebase.database().ref(DatabaseNode+"/ChannelDialogues/"+channel.id+"/Messages");
        ExistingObservers.push(ref)
        ref.on('value', snapshot => {
            if(count <= 0) {
            var messages = [];
            console.log("Processiing specific channel change for :"+channel.Name);
            
               snapshot.forEach(message => {
                   var key = message.key;
                   var timeKey = (key.split(","))[0];
                   var senderId = (key.split(","))[1];
                   var mes = {
                       Message: message.val(),
                       Time: timeKey,
                       Sender: senderId
                   };
                   messages.push(mes);
               });
            var lastMessage = messages[messages.length - 1];
            var sendTo = [];
            try {   
                console.log(lastMessage.Message);
                channel.Subs.forEach(person => {
                    if(person != lastMessage.Sender) {
                        sendTo.push(person);
                    }
                })
            console.log("sending to:" + sendTo+"|");
            Subscribers.forEach(subscriber => {
               if(sendTo.indexOf(subscriber.Id) > -1) {
                   console.log(subscriber.Id);
                   if(subscriber.Type == "IOS") {
                       var croppedMessage = lastMessage.Message;
                       if (lastMessage.Message.length > 50) {
                           croppedMessage = lastMessage.Message.substring(0, 50);
                           croppedMessage = croppedMessage + "...";
                       }
                        SendIOSNotification(subscriber.NotificationId, channel.Name +":\n"+croppedMessage , 'ping.aiff', "CDM"+channel.id, 3 );
                    } 
                    else if(subscriber.Type == "Android") {
                        var croppedMessage = lastMessage.Message;
                        if (lastMessage.Message.length > 30) {
                           croppedMessage = lastMessage.Message.substring(0, 30);
                           croppedMessage = croppedMessage + "...";
                       }
                        SendAndroidNotification(subscriber.NotificationId, channel.Name, croppedMessage, "CDM"+channel.id);
                    }
               }
            });
            }
            catch(e) {
                
            }
        }
         count--;                                                                        
        });
    });
}
