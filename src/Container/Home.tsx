import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

const Home = ({navigation}: any) => {

  const buttonOptions = [
    {
      title: 'Capture Video',
      onPress: () => navigation.navigate('CameraScreen'),
    },
    {
      title: 'Upload',
      onPress: () => navigation.navigate('Upload'),
    },
  ];
  return (
    <View style={styles.center}>
      {buttonOptions.map((item, index) => {
        return (
          <TouchableOpacity
            key={index.toString()}
            onPress={item.onPress}
            style={styles.button}>
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#3467eb',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '75%',
    height: 50,
    marginTop: 20,
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
  video: {
    height: 100,
    width: 200,
  },
});
