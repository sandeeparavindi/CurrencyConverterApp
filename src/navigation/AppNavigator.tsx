// src/navigation/AppNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Screens
import ConversionScreen from '../screens/ConversionScreen';
import HistoricalRatesScreen from '../screens/HistoricalRatesScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Auth Navigator
import AuthNavigator from './AuthNavigator';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main tab navigator
const MainNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string;

                    if (route.name === 'Convert') {
                        iconName = focused ? 'currency-usd' : 'currency-usd-off';
                    } else if (route.name === 'History') {
                        iconName = focused ? 'chart-line' : 'chart-line-variant';
                    } else if (route.name === 'Favorites') {
                        iconName = focused ? 'star' : 'star-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'cog' : 'cog-outline';
                    } else {
                        iconName = 'help-circle';
                    }

                    return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#4775EA',
                tabBarInactiveTintColor: 'gray',
                headerStyle: {
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f0f0f0',
                },
            })}
        >
            <Tab.Screen
                name="Convert"
                component={ConversionScreen}
                options={{ title: 'Currency Converter' }}
            />
            <Tab.Screen
                name="History"
                component={HistoricalRatesScreen}
                options={{ title: 'Historical Rates' }}
            />
            <Tab.Screen
                name="Favorites"
                component={FavoritesScreen}
                options={{ title: 'My Favorites' }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: 'Settings' }}
            />
        </Tab.Navigator>
    );
};

// Root navigator
const AppNavigator: React.FC = () => {
    // In a real app, you would check if the user is authenticated
    // by checking if a token exists in secure storage
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    // For this demo, we'll allow skipping the auth flow
    const skipAuth = true;

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated && !skipAuth ? (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                ) : (
                    <Stack.Screen name="Main" component={MainNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
