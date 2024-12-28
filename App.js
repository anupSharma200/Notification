import React,{useEffect} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, StyleSheet, Button } from "react-native";

import HomeScreen from "./Src/HomeScreen";
import NotificationScreen from "./Src/NotificationScreen";
import * as Notifications from 'expo-notifications';


const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const message = response.notification.request.content.data.message;
        // Get the navigator ref to navigate from outside React components
        if (navigationRef.current) {
          navigationRef.current.navigate('Notification', { message });
        }
      }
    );

    return () => {
      backgroundSubscription.remove();
    };
  }, []);

  const navigationRef = React.createRef();
  return (

      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="Home" 
          screenOptions={{ headerShown: false }}
        >
             <Stack.Screen name="Home" component={HomeScreen} />
             <Stack.Screen name="Notification" component={NotificationScreen} />
        </Stack.Navigator>
      </NavigationContainer>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default App;


// App.js
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from './screens/HomeScreen';
// import NotificationScreen from './screens/NotificationScreen';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen 
//           name="Home" 
//           component={HomeScreen} 
//           options={{ title: 'Home' }}
//         />
//         <Stack.Screen 
//           name="NotificationScreen" 
//           component={NotificationScreen} 
//           options={{ title: 'Notification' }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
