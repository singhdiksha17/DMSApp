import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Picker } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import DatePicker from 'react-native-datepicker';
import axios from 'axios';

export default function UploadScreen({ route }) {
  const { token } = route.params; // token passed from Login
  const [file, setFile] = useState(null);
  const [documentDate, setDocumentDate] = useState('');
  const [majorHead, setMajorHead] = useState('');
  const [minorHead, setMinorHead] = useState('');
  const [tags, setTags] = useState('');
  const [remarks, setRemarks] = useState('');
  const [minorOptions, setMinorOptions] = useState([]);

  // Update minor_head options based on major_head
  useEffect(() => {
    if (majorHead === 'Personal') {
      setMinorOptions(['John', 'Tom', 'Emily']);
    } else if (majorHead === 'Professional') {
      setMinorOptions(['Accounts', 'HR', 'IT', 'Finance']);
    } else {
      setMinorOptions([]);
    }
  }, [majorHead]);

  // Pick a file
  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      setFile(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Cancelled');
      } else {
        Alert.alert('Error', 'Failed to pick file');
      }
    }
  };

  // Upload file
  const uploadFile = async () => {
    if (!file || !majorHead || !minorHead || !documentDate) {
      Alert.alert('Error', 'Please fill all fields and select a file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });

      const dataObj = {
        major_head: majorHead,
        minor_head: minorHead,
        document_date: documentDate,
        document_remarks: remarks,
        tags: tags.split(',').map(tag => ({ tag_name: tag.trim() })),
        user_id: 'nitin', // replace with dynamic user if available
      };

      formData.append('data', JSON.stringify(dataObj));

      const res = await axios.post(
        'https://apis.allsoft.co/api/documentManagement/saveDocumentEntry',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            token: token,
          },
        }
      );

      console.log(res.data);
      Alert.alert('Success', 'File uploaded successfully');
      // Clear form
      setFile(null);
      setDocumentDate('');
      setMajorHead('');
      setMinorHead('');
      setTags('');
      setRemarks('');
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'File upload failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Document</Text>

      <Button title="Pick File" onPress={pickFile} />
      {file && <Text>Selected: {file.name}</Text>}

      <Text style={styles.label}>Document Date:</Text>
      <DatePicker
        style={{ width: '100%', marginBottom: 10 }}
        date={documentDate}
        mode="date"
        placeholder="Select date"
        format="YYYY-MM-DD"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        onDateChange={setDocumentDate}
      />

      <Text style={styles.label}>Major Head:</Text>
      <Picker selectedValue={majorHead} onValueChange={setMajorHead} style={styles.picker}>
        <Picker.Item label="Select Major Head" value="" />
        <Picker.Item label="Personal" value="Personal" />
        <Picker.Item label="Professional" value="Professional" />
      </Picker>

      <Text style={styles.label}>Minor Head:</Text>
      <Picker selectedValue={minorHead} onValueChange={setMinorHead} style={styles.picker}>
        <Picker.Item label="Select Minor Head" value="" />
        {minorOptions.map(opt => (
          <Picker.Item key={opt} label={opt} value={opt} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Tags (comma separated)"
        value={tags}
        onChangeText={setTags}
      />

      <TextInput
        style={styles.input}
        placeholder="Remarks"
        value={remarks}
        onChangeText={setRemarks}
      />

      <Button title="Upload File" onPress={uploadFile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { marginTop: 10 },
  picker: { height: 50, width: '100%' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
});
