import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProfileCard from './ProfileCard';
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from '../../context/AuthProvider'


const StarsScreen: React.FC = () => {

  const { user } = useContext(AuthContext)
  const [activeFilter, setActiveFilter] = useState('All');
  const [influencerList, setInfluencerList] = useState([])

  const userInfo = async () => {
    const influencers = await firestore().collection('influencers').get();
    let tempData: any = [];
    influencers.forEach((doc) => {
      tempData.push(doc.data());
    });
    setInfluencerList(tempData)
  }

  useEffect(() => {
    userInfo();
  })

  return (
    <View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.recommendedSection}>
          <View style={styles.recom}>
            <Icon name='fire' color="red" size={30}></Icon>
            <Text style={styles.recommendedText}>Recommended to you</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.moreText}>more</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal style={styles.profileCardScrollView}>
          <View style={styles.profileCard}>
            {influencerList.map((item, index) => (
              <ProfileCard key={index} username={item.username} id={item.userId}/>
            ))}
          </View>
        </ScrollView>
        <ScrollView horizontal style={styles.filterContainerScrollView}>
          <View style={styles.filterContainer}>
            {['All','Instagram', 'Twitter', 'Youtube', 'Facebook'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  activeFilter === filter && styles.activeFilterButton
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === filter && styles.activeFilterText
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {

  },
  profileCardScrollView: {

  },
  filterContainerScrollView: {
    padding: 10,
  },
  recommendedSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  recommendedText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black'
  },
  moreText: {
    fontSize: 16,
    color: 'grey',
    fontWeight: 'bold',
    marginEnd: 10
  },
  recom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  profileCard: {
    flexDirection: 'row',
    marginTop: -10,
    paddingLeft: 5,
    paddingRight: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 25,
    marginHorizontal: 5,
    backgroundColor: 'white',
  },
  activeFilterButton: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    backgroundColor: 'black',
  },
  filterText: {
    color: 'black',
    fontWeight: 'bold',
  },
  activeFilterText: {
    color: 'white',
  },
});

export default StarsScreen;