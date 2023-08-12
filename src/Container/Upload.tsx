import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {FlatList} from 'react-native-gesture-handler';

const Upload = (props: any) => {
  const {file} = props?.route?.params;
  const _renderItem = ({item}: any) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item?.file?.name}</Text>
      <Text style={[styles.download, item?.loaded === 100 && {color: 'green'}]}>
        Uploaded {item?.loaded}%
      </Text>
    </View>
  );
  const _empty = () => (
    <View style={styles.center}>
      <Text style={styles.nofiles}>You haven't uploaded any videos yet</Text>
    </View>
  );

  return (
    <View style={{padding: 10}}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => props?.navigation.goBack()}>
        <Text style={{color: 'white', fontWeight: '500'}}>Go Back</Text>
      </TouchableOpacity>
      <FlatList
        data={file}
        renderItem={_renderItem}
        keyExtractor={item => item?.file?.name.toString()}
        style={{marginBottom: 50}}
        ListEmptyComponent={_empty}
      />
    </View>
  );
};

export default Upload;

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#cf6f15',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    color: 'white',
  },
  nofiles: {
    fontSize: 18,
    color: 'red',
  },
  download: {
    color: 'red',
    fontSize: 15,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  btn: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    marginTop: 10,
    backgroundColor: '#347deb',
    borderColor: '#fff',
    width: 100,
  },
});
