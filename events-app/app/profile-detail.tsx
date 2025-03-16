import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
import { GestureHandlerRootView, RefreshControl, } from 'react-native-gesture-handler';
import { useRouter, Stack ,useLocalSearchParams} from "expo-router";
import { dummyProfiles } from '@/data/profile';
interface Profile {
  id: string;
  name: string;
}

const ProfileItems: React.FC<Profile> = ({ id, name }) => {
  const router = useRouter();
  const handleNavigation = () => {
    router.push({
      pathname: "/profile-detailscreen",
      params: { profileid: id, name }
    });
  };
  return (
    <TouchableOpacity style={styles.card} onPress={handleNavigation}>
      <Text>{id}. {name}</Text>
    </TouchableOpacity>
  );
}

export function ProfileDetailsScreen() {
    const params = useLocalSearchParams();
    const { name, id } = params;
   
    return (
      <View style={styles.detailsContainer}>

        <Text style={styles.info}>Name: {name as string}</Text>
        <Text style={styles.info}>Profile ID: {id as string}</Text>
        {/* Add more profile details here */}
      </View>
    );
  }

export default function ProfileScreen() {
  
  

  const renderItem = ({ item }: { item: Profile }) => (
    <ProfileItems
      id={item.id}
      name={item.name}
    />
  );

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: true }} />
      <GestureHandlerRootView style={styles.container}>
        <FlatList
          data={dummyProfiles}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => console.log('refreshing profiles...')}
            />
          }
        />
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  card: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    marginVertical: 5,
    marginTop:20,
    padding: 30
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
});
