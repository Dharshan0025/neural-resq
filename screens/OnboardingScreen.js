import React, { useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');
const slides = [
  { title: "Voice SOS", desc: "Trigger emergency help with your voice instantly.", anim: require('../assets/lottie/voice.json') },
  { title: "Ambulance Dispatch", desc: "Book and track ambulances on live map.", anim: require('../assets/lottie/ambulance.json') },
  { title: "Volunteer Help", desc: "Get instant help from nearby volunteers.", anim: require('../assets/lottie/volunteer.json') },
  { title: "Rural & Urban Coverage", desc: "One app for all emergencies.", anim: require('../assets/lottie/rural.json') },
];

export default function OnboardingScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const ref = useRef();

  const goNext = () => {
    if (index === slides.length - 1) navigation.replace('Login');
    else {
      ref.current.scrollToIndex({ index: index + 1 });
      setIndex(index + 1);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={ref}
        data={slides}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <LottieView source={item.anim} autoPlay loop style={{ height: 180 }} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
        )}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        pagingEnabled
        onMomentumScrollEnd={ev => {
          setIndex(Math.round(ev.nativeEvent.contentOffset.x / width));
        }}
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, { opacity: index === i ? 1 : 0.3 }]} />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={goNext}>
        <Text style={styles.buttonText}>{index === slides.length -1 ? 'Start' : 'Next'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A2239',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 24,
    textAlign: 'center',
    letterSpacing: 1,
  },
  desc: {
    fontSize: 16,
    color: '#dbeafe',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.85,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 6,
  },
  button: {
    backgroundColor: '#F6C90E',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 8,
    elevation: 3,
    shadowColor: '#F6C90E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#0A2239',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
    textAlign: 'center',
  },
});
