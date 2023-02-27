import HomePage from "./screens/HomePage";
import Register from "./screens/Register";
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
        component={HomePage}
      />
      <Stack.Screen
        name="Register"
        options={{headerShown: false}}
        component={Register}
      />
      <Stack.Screen
        name="Groups"
        component={Groups}
      />
      <Stack.Screen
        name="Group"
        component={Group}
        options={({ route }) => ({ title: route.params.grupo.nome_grupo })}
      />
      </Stack.Navigator>
    </NavigationContainer>
  )
}