import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import DatePicker from 'react-native-datepicker';
import axios from 'axios';
import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';
import Pdf from 'react-native-pdf';
import { Image } from 'react-native';

export default function SearchScreen({ route }) {
  const { token } = route.params;
  const [majorHead, setMajorHead] = useState('');
  const [minorHead, setMinorHead] = useState('');
  const [tags, setTags] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [results, setResults] = useState([]);

  const searchDocuments = async () => {
    try {
      const res = await axios.post(
        'https://apis.allsoft.co/api/documentManagement/searchDocumentEntry',
        {
          major_head: majorHead,
          minor_head: minorHead,
          from_date: fromDate,
          to_date: toDate,
          tags: tags.split(',').map(tag => ({ tag_name: tag.trim() })),
          start: 0,
          length: 20,
          filterId: '',
          search: { value: '' },
        },
        { headers: { token } }
      );

      console.log(res.data);
      if (res.data && res.data.length > 0) {
        setResults(res.data);
      } else {
        Alert.alert('No results found');
        setResults([]);
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Search failed');
    }
  };

  const downloadFile = async (fileUrl, fileName) => {
    try {
      const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const download = await RNFS.downloadFile({ fromUrl: fileUrl, toFile: path }).promise;
      if (download.statusCode === 200) {
        Alert.alert('Success', `File downloaded: ${path}`);
      } else {
        Alert.alert('Error', 'Failed to download file');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Download failed');
    }
  };

  const renderItem = ({ item }) => {
    const isImage = item.file_url.endsWith('.png') || item.file_url.endsWith('.jpg') || item.file_url.endsWith('.jpeg');
    const isPdf = item.file_url.endsWith('.pdf');

    return (
      <View style={styles.resultItem}>
        <Text style={styles.fileName}>{item.file_name || 'Document'}</Text>

        {isImage && <Image source={{ uri: item.file_url }} style={{ width: 200, height: 200 }} />}
        {isPdf && <Pdf source={{ uri: item.file_url }} style={{ width: 200, height: 300 }} />}

        {!isImage && !isPdf && <Text>Preview not available</Text>}

        <Button title="Download" onPress={() => downloadFile(item.file_url, item.file_name)} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Documents</Text>

      <TextInput
        style={styles.input}
        placeholder="Major Head"
        value={majorHead}
        onChangeText={setMajorHead}
      />
      <TextInput
        style={styles.input}
        placeholder="Minor Head"
        value={minorHead}
        onChangeText={setMinorHead}
      />
      <TextInput
        style={styles.input}
        placeholder="Tags (comma separated)"
        value={tags}
        onChangeText={setTags}
      />

      <Text>From Date:</Text>
      <DatePicker
        style={{ width: '100%', marginBottom: 10 }}
        date={fromDate}
        mode="date"
        placeholder="Select From Date"
        format="YYYY-MM-DD"
        onDateChange={setFromDate}
      />

      <Text>To Date:</Text>
      <DatePicker
        style={{ width: '100%', marginBottom: 10 }}
        date={toDate}
        mode="date"
        placeholder="Select To Date"
        format="YYYY-MM-DD"
        onDateChange={setToDate}
      />

      <Button title="Search" onPress={searchDocuments} />

      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  resultItem: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
  fileName: { fontWeight: 'bold', marginBottom: 5 },
});

