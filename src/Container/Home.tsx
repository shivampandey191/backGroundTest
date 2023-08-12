import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Video from 'react-native-video';

const Home = ({navigation}: any) => {
  const [video, setVideo] = useState();

  const buttonOptions = [
    {
      title: 'Capture Video',
      onPress: () => navigation.navigate('CameraScreen', {getVideo: setVideo}),
    },
    {
      title: 'Video',
    },
    {
      title: 'Upload',
      onPress: () => navigation.navigate('Upload'),
    },
  ];
  return (
    <View style={styles.center}>
      {buttonOptions.map((item, index) => {
        return item.title === 'Video' ? (
          video ? (
            <Video
              source={{uri: 'background'}} // Can be a URL or a local file.
              style={styles.video}
            />
          ) : (
            <></>
          )
        ) : (
          <TouchableOpacity onPress={item.onPress} style={styles.button}>
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
