import HomePage from "./screens/HomePage";
import Register from "./screens/Register";
import Login from "./screens/Login";
import Groups from "./screens/Groups";
import Users from "./screens/Users";
import Group from "./screens/Group";
import User from "./screens/User";
import Files from "./screens/Files";
import Task from "./screens/Task";
import AddUsers from "./screens/AddUsers";
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
      <Stack.Screen
        name="Users"
        component={Users}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="User"
        component={User}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddUsers"
        component={AddUsers}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Task"
        component={Task}
        options={{headerShown: false}}
      />
      {<Stack.Screen
        name="Files"
        component={Files}
        options={{headerShown: false}}
      />}
      </Stack.Navigator>
    </NavigationContainer>
  )
}