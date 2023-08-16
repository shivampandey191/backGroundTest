import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Platform} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import Video from 'react-native-video';
import Upload from 'react-native-background-upload';
import { useDispatch } from 'react-redux'
import { update } from '../Redux/videoReducer';

function CameraScreen({navigation}: any) {
  const dispatch = useDispatch()

  const camera = useRef<any>(null);
  const devices = useCameraDevices();
  const device = devices.back;

  const [showCamera, setShowCamera] = useState(true);
  const [isStopped, setIsStopped] = useState(true);
  const [showUpload, setShowUpload] = useState(true);
  const [videoSource, setVideoSource] = useState<any>();

  const UploadVideo1 = () => {
    setShowUpload(false);
    const options: any = {
      url: 'http://10.0.2.2:3000/uploadVideo',
      path:
        Platform.OS === 'android'
          ? videoSource?.path.replace('file://', '')
          : videoSource?.path,
      method: 'POST',
      type: 'raw',
      maxRetries: 2, 
      headers: {
        'content-type': 'application/octet-stream',
        'my-custom-header': 's3headervalueorwhateveryouneed',
      },
      notification: {
        enabled: true,
      },
      useUtf8Charset: true,
    };
    Upload.startUpload(options)
      .then(uploadId => {
        console.log('Upload started');
        Upload.addListener('progress', uploadId, data => {
          console.log(`Progress: ${data?.progress}%`);
          dispatch(update({
            name:videoSource.name,loaded:data?.progress
          }))
        });
        Upload.addListener('error', uploadId, data => {
          console.log(`Error: ${data.error}%`);
        });
        Upload.addListener('cancelled', uploadId, data => {
          console.log('Cancelled!');
        });
        Upload.addListener('completed', uploadId, data => {
          console.log('Completed!');
        });
      })
      .catch(err => {
        console.log('Upload error!', err);
      });
  };

  useEffect(() => {
    async function getPermission() {
      const newCameraPermission = await Camera.requestCameraPermission();
      console.log(newCameraPermission);
    }
    getPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setShowCamera(true);
      setShowUpload(true);
    });
    return unsubscribe;
  }, [navigation]);

  const captureVideo = async () => {
    setIsStopped(false);
    if (camera?.current !== null) {
      try {
        await camera?.current.startRecording({
          flash: 'off',
          onRecordingFinished: (video: any) => {
            setVideoSource(getUploadMedia(video));
          },
          onRecordingError: (error: any) => console.error(error),
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const getUploadMedia = (media: any) => {
    const extension = 'mp4';
    let video = media?.path || media?.uri;
    if (media?.data) {
      video = `data:${media?.mime};base64,${media?.data}`;
    }
    return {
      uri: video,
      fileName: `media_${Date.now()}.${extension}`,
      name: `media__${Date.now()}.${extension}`,
      path: media?.path,
      fileSize: media?.size,
      data: media?.path,
    };
  };

  const stopRecording = async () => {
    try {
      await camera.current.stopRecording();
    } catch (error) {
      console.log(error);
    }
    setIsStopped(true);
    setShowCamera(false);
  };

  if (device == null) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Camera not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showCamera ? (
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={showCamera}
            video={true}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => (isStopped ? captureVideo() : stopRecording())}>
              <View style={styles.camButton}>
                {!isStopped && <View style={styles.record} />}
              </View>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {videoSource && (
            <Video source={{uri: videoSource?.path}} style={styles.thumbnail} />
          )}
          <View style={styles.backButton}>
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor: '#347deb',
                  borderColor: '#fff',
                  width: 100,
                },
              ]}
              onPress={() => navigation?.goBack()}>
              <Text style={{color: 'white', fontWeight: '500'}}>Go Back</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={[
                  styles.btn,
                  {
                    backgroundColor: '#fff',
                    borderColor: '#347deb',
                  },
                ]}
                onPress={() => {
                  setShowCamera(true);
                  setShowUpload(true);
                }}>
                <Text style={{color: '#347deb', fontWeight: '500'}}>
                  Retake
                </Text>
              </TouchableOpacity>
              {showUpload && (
                <TouchableOpacity
                  style={[
                    styles.btn,
                    {
                      backgroundColor: '#347deb',
                      borderColor: 'white',
                    },
                  ]}
                  onPress={() => {
                    UploadVideo1();
                  }}>
                  <Text style={{color: 'white', fontWeight: '500'}}>
                    Upload
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'gray',
  },
  backButton: {
    position: 'absolute',
    justifyContent: 'center',
    width: '100%',
    top: 0,
    padding: 20,
  },
  buttonContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    bottom: 0,
    padding: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  thumbnail: {
    width: '80%',
    height: '80%',
    alignSelf: 'center',
    marginLeft: 30,
  },
  btn: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
  },
  camButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#B2BEB5',
    alignSelf: 'center',
    borderWidth: 4,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  record: {
    height: 40,
    width: 40,
    backgroundColor: '#eb345e',
  },
});

export default CameraScreen;
