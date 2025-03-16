import React,{useState,useEffect} from 'react';
import { StyleSheet, View, FlatList, SafeAreaView, StatusBar,TouchableOpacity,ScrollView, Text, Image,ActivityIndicator,Platform } from 'react-native';
import { GestureHandlerRootView, RefreshControl } from 'react-native-gesture-handler';
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
// import { dummyEvents } from '@/data/events'; // Adjust this path as needed

interface ApiEvent {
  id: number;
  name: string;
  description: string;
  qr_code: string;
  date: string;
}
interface EventItemProps {
  index :number;
  id: number;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
}

const EventItems: React.FC<EventItemProps> = ({ index,id, title, description, date,  imageUrl}) => {
  const router = useRouter();
  const handleNavigation = () => {
    router.push({
      pathname: "/eventsdetails",
      params: { index: index, id, title, description, date, imageUrl }
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleNavigation}>
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{index +1}. {title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
          <Text style={styles.dateText}>{new Date(date).toLocaleDateString()}</Text>
        </View>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.cardImage} 
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
}


// export function EventsDetailsScreen() {
//   const params = useLocalSearchParams();
//   const { title, description, date, imageUrl } = params;

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.qrContainer}>
//         <Image source={{ uri: imageUrl as string }} style={styles.qrImage} />
//       </View>

//       <View style={styles.content}>
//         <Text style={styles.title}>{title as string}</Text>
//         <Text style={styles.description}>{description as string}</Text>

//         <View style={styles.infoContainer}>
//           <Text style={styles.label}>📅 Date:</Text>
//           <Text style={styles.info}>{new Date(date as string).toLocaleDateString()}</Text>
//         </View>

//         <View style={styles.infoContainer}>
//           <Text style={styles.label}>⏰ Time:</Text>
//           <Text style={styles.info}>{new Date(date as string).toLocaleTimeString()}</Text>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

export function EventsDetailsScreen() {
  const params = useLocalSearchParams();
  const {index, title, description, date, imageUrl } = params;
  const displayIndex = parseInt(index as string) + 1;
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Events Details</Text>
        </View>
         */}
        <View style={styles.contentContainer}>
        <View style={styles.card}>
          <View style={styles.idContainer}>
            <Text style={styles.eventId}>{`${displayIndex}. ${title}`}</Text>
          </View>
          
          <Text style={styles.description}>{description as string}</Text>
          
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Date:</Text>
            <Text style={styles.dateValue}>{new Date(date as string).toLocaleDateString()}</Text>
          </View>
          
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Time:</Text>
            <Text style={styles.dateValue}>{new Date(date as string).toLocaleTimeString()}</Text>
          </View>
          </View>
          <View style={styles.qrCodeContainer}>
            <Image 
              source={{ uri: imageUrl as string }} 
              style={styles.qrCode} 
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


export default function HomeScreen() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchEvents = async () => {
    try {
      setError(null);
      
      let apiUrl;
    if (Platform.OS === 'android') {
      // For Android emulator
      apiUrl = 'http://10.0.2.2:8000/api/events/';
    } else if (Platform.OS === 'ios') {
      // For iOS simulator
      apiUrl = 'http://localhost:8000/api/events/';
    } else {
      // For web platform
      apiUrl = 'http://127.0.0.1:8000/api/events/';
    }
    
    
    console.log('Fetching from:', apiUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(apiUrl, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      const sortedData = data.sort((a, b) => a.id - b.id);
      setEvents(sortedData);
      
      setLoading(false);
      
    } 
    catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again later.');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };
  const renderItem = ({ item,index }: { item: ApiEvent,index:number }) => (
    <EventItems
     index={index}
      id={item.id}
      title={item.name}
      description={item.description}
      date={item.date}
      
      imageUrl={item.qr_code}
    />
  );
  if (loading && !refreshing) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchEvents}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <GestureHandlerRootView style={styles.container}>
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyList}>
              <Text>No events found</Text>
            </View>
          }
        />
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#111827',
  },
  container: {
    flexGrow: 1,
  },
  headerContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  idContainer: {
    marginBottom: 16,
  },
  eventId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    width: 60,
  },
  dateValue: {
    fontSize: 16,
    color: '#334155',
    flex: 1,
  },
  qrCodeContainer: {
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrCode: {
    width: 200,
    height: 200,
  },



  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 20,
  },
  qrImage: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
  content: {
    width: '100%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },},

   centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    marginVertical: 8,
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1E293B',
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 5,
    color: '#475569',
  },
  dateText: {
    fontSize: 12,
    color: '#64748B',
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 120,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
    marginLeft: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 24,
    lineHeight: 22,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
    marginRight: 5,
  },


  info: {
    fontSize: 14,
    // marginBottom:5,
    color: '#64748B',
  },
  emptyList: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },

});