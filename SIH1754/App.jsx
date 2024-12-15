import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthNavigator from "./app/Auth/AuthNavigator";
import Tab from "./app/Navigation/Tab";
import Header from "./app/components/Header";
import { AuthProvider } from "./app/Auth/AuthContext";
import { useAuth } from "./app/Auth/AuthContext";
import { DataProvider } from "./app/components/DataProvider";

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
    return (
        <InsideStack.Navigator>
            <InsideStack.Screen
                name="Tab"
                component={Tab}
                options={{ header: () => <Header title="SEVA FLOW" /> }}
            />
        </InsideStack.Navigator>
    );
}

function AppNavigator() {
    const { user } = useAuth();
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    <Stack.Screen
                        name="Inside"
                        component={InsideLayout}
                        options={{ headerShown: false }}
                    />
                ) : (
                    <Stack.Screen
                        name="AuthNavigator"
                        component={AuthNavigator}
                        options={{ headerShown: false }}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <AuthProvider>
             <DataProvider>
            <AppNavigator />
            </DataProvider>
        </AuthProvider>
    );
}
