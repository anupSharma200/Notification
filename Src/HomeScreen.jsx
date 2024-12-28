import React, { useEffect, useState, useRef } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert, Platform } from "react-native"; 
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function HomeScreen() {
  const navigation = useNavigation();
  const [message, setMessage] = useState(""); 
  const [expoPushToken, setExpoPushToken] = useState(""); 
  const [notification, setNotification] = useState(false); 
  const notificationListener = useRef(); 
  const responseListener = useRef(); 


  async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
      // Check notification permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert("Failed to get push token for push notification!");
        return;
      }

      
      try {
        token = (await Notifications.getExpoPushTokenAsync()).data; 
        console.log("Expo Push Token:", token); 
      } catch (error) {
        console.error("Error fetching push token:", error);
      }
    } else {
      Alert.alert("Must use a physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

 
  const sendNotification = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message");
      return;
    }

    try {
    
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "New Message",
          body: message,
          data: { message:message }, 
        },
        trigger: { seconds: 2 }, 
      });

      setMessage(""); 
      Alert.alert("Success", "Notification Sent Successfully!");
    } catch (error) {
      console.error("Error sending notification:", error); 
      Alert.alert("Error", "Failed to send notification");
    }
  };


  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));


    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
        Alert.alert("Notification Received", notification.request.content.body || "No message");
      }
    );

  
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const message = response.notification.request.content.data.message; 
        navigation.navigate("Notification", { message });
      }
    );

    return () => {
   
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Type a Message:</Text>
      <TextInput
        style={styles.input}
        placeholder="Type a short message"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <Button title="Send Notification" onPress={sendNotification} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "100%",
    marginBottom: 20,
    borderRadius: 5,
    marginVertical:20
  },
});
