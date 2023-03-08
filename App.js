import HomePage from "./screens/HomePage";
import Register from "./screens/Register";
import Login from "./screens/Login";
import Groups from "./screens/Groups";
import Group from "./screens/Group";
import { NavigationContainer, NavigationRouteContext } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App(){
  return(
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen
        name="Home"
        options={{headerShown: false}}
        component={HomePage}
      />
      <Stack.Screen
        name="Register"
        options={{headerShown: false}}
        component={Register}
      />
      <Stack.Screen
        name="Login"
        options={{headerShown: false}}
        component={Login}
      />
      <Stack.Screen
        name="Groups"
        options={{headerShown: false}}
        component={Groups}
      />
      <Stack.Screen
        name="Group"
        component={Group}
        options={{headerShown: false}}
      />
      </Stack.Navigator>
    </NavigationContainer>
  )
}