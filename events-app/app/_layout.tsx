import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Platform, Linking, Image } from 'react-native';
import { DrawerContentComponentProps, DrawerNavigationOptions } from '@react-navigation/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, colorScheme]);

  if (!loaded) {
    return null;
  }
  
  const headerBackgroundColor = colorScheme === 'dark' ? '#0f172a' : '#0f172a';
  const headerTintColor = colorScheme === 'dark' ? '#ffffff' : '#ffffff';
  
  const screenOptions: DrawerNavigationOptions = {
    headerStyle: {
      backgroundColor: headerBackgroundColor,
    },
    headerTintColor: headerTintColor,
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    return (
      <DrawerContentScrollView {...props}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/logo.jpg')}
            style={styles.logo}
            resizeMode="contain" 
          />
        </View>
        <DrawerItemList {...props} />
        <DrawerItem 
          label="More Info"
          onPress={() => Linking.openURL('https://www.google.com')}
          icon={({color, size}) => (
            <Ionicons name="information-circle-outline" color={color} size={size} />
          )}
        />
      </DrawerContentScrollView>
    );
  };
  
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Drawer 
        screenOptions={screenOptions}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Home',
            title: 'Home',
            headerTitle: "Event App",
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold'
            },
            drawerIcon: ({size, color}) => (
              <Ionicons name='home' size={size} color={color} />
            )
          }}
        /> 
        <Drawer.Screen
          name="profile-detail"
          options={{
            drawerLabel: 'Profile',
            title: 'Profile',
            headerTitle: "Profile",
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold'
            },
            drawerIcon: ({size, color}) => (
              <MaterialCommunityIcons name='face-man-profile' size={size} color={color} />
            )
          }}
        />
        <Drawer.Screen
          name="eventsdetails"
          options={({ navigation }) => ({
            drawerLabel: 'Events Details',
            title: 'Events Details',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold'
            },
            drawerItemStyle: {
              display: 'none'
            },
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginLeft: 16 }}
              >
                <Ionicons name="arrow-back" size={24} color={headerTintColor} />
              </TouchableOpacity>
            ),
            swipeEnabled: false, // Disable drawer swipe gesture
          })}
        />
        <Drawer.Screen
          name="profile-detailscreen"
          options={({navigation}) => ({
            drawerLabel: 'Profile Details',
            title: 'Profile Details',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold'
            },
            drawerItemStyle: {
              display: 'none'
            },
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => navigation.navigate('profile-detail')}
                style={{marginLeft: 16}}
              >
                <Ionicons name="arrow-back" size={24} color={headerTintColor} />
              </TouchableOpacity>
            ),
            swipeEnabled: false,
          })}
        />
      </Drawer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    padding: 1,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});