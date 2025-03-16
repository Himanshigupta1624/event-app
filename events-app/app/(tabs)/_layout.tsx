import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        headerShown: false,
        // tabBarShowLabel:false,
        tabBarStyle:{
          backgroundColor:'#0f172a'
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          
          tabBarIcon: ({ color, focused,size, }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color}  size={focused? 35 : size }/>
          ),
        }}
      />
      <Tabs.Screen
        name="Add-detail"
        options={{
          title: 'Add Events',
          tabBarIcon: ({ color, focused ,size}) => (
            <TabBarIcon name={focused ? 'create' : 'create-outline'} color={color} size={focused? 35 : size } />
          ),
        }}
      />
    </Tabs>
  );
}
