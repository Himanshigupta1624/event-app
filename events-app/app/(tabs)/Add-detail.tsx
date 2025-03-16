import React, { useLayoutEffect, useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  KeyboardAvoidingView, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from 'expo-router';
import { HeaderBackButton } from '@react-navigation/elements';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddEventDetails = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigation = useNavigation();
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Add New Event',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white',
      },
      headerStyle: {
        backgroundColor: '#0F172A',
      },
      headerLeft: () => (
        <HeaderBackButton
          tintColor='white'
          onPress={() => navigation.goBack()}
        />
      )
    });
  }, []);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleAddEvent = async () => {
    // Form validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an event name');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter an event description');
      return;
    }

    setLoading(true);
    
    try {
      const d = date.toISOString().slice(0, 10);
      
      let apiUrl;
      if (Platform.OS === 'android') {
        apiUrl = 'http://10.0.2.2:8000/api/events/';
      } else if (Platform.OS === 'ios') {
        apiUrl = 'http://localhost:8000/api/events/';
      } else {
        apiUrl = 'http://127.0.0.1:8000/api/events/';
      }
      
      const data = {
        name,
        description,
        date: d,
      };
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      await response.json();
      setSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setName('');
        setDescription('');
        setDate(new Date());
        setSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error adding event:', error);
      Alert.alert(
        'Error',
        'Failed to add event. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          {success && (
            <View style={styles.successBanner}>
              <Text style={styles.successText}>Event added successfully!</Text>
            </View>
          )}
          
          <Text style={styles.label}>Event Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter event name"
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />
          
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Enter event description"
            multiline={true}
            numberOfLines={4}
            style={styles.textArea}
            placeholderTextColor="#9CA3AF"
          />
          
          <Text style={styles.label}>Event Date</Text>
          <TouchableOpacity 
            style={styles.datePickerButton} 
            onPress={showDatepicker}
          >
            <Text style={styles.dateText}>{date.toDateString()}</Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}
          
          <TouchableOpacity 
            style={[
              styles.addButton, 
              (loading || !name || !description) && styles.disabledButton
            ]}
            onPress={handleAddEvent}
            disabled={loading || !name || !description}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.addButtonText}>ADD EVENT</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
    marginBottom: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  datePickerButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
    marginBottom: 24,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#1E293B',
  },
  addButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#93C5FD',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successBanner: {
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  successText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default AddEventDetails;