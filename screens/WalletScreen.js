import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';

const WalletScreen = () => {
  const navigation = useNavigation();
  const [balance, setBalance] = useState(1250);
  const [activeTab, setActiveTab] = useState('credits');

  // Mock data
  const transactions = [
    { id: 1, type: 'credit', amount: 500, description: 'Ambulance Credit Purchase', date: 'Today, 10:45 AM' },
    { id: 2, type: 'debit', amount: 300, description: 'Emergency Dispatch', date: 'Yesterday, 2:30 PM' },
    { id: 3, type: 'credit', amount: 1000, description: 'Wallet Recharge', date: 'Mar 15, 9:15 AM' },
    { id: 4, type: 'debit', amount: 150, description: 'Priority Response', date: 'Mar 12, 5:45 PM' },
  ];

  const subscriptionPlans = [
    { id: 'urban', name: 'Urban Plan', price: '₹299/month', features: ['Pay-per-use ambulances', 'Basic life support'] },
    { id: 'rural', name: 'Rural Plan', price: '₹499/month', features: ['Panchayat coverage', '3 free dispatches'] },
    { id: 'premium', name: 'Premium Plan', price: '₹999/month', features: ['Priority response', 'ALS support', 'Family coverage'] },
  ];

  const handleRecharge = (amount) => {
    setBalance(balance + amount);
    // In a real app, this would call your payment API
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#D62828', '#F77F00']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {/* Balance Card */}
      <LinearGradient
        colors={['#0077B6', '#00B4D8']}
        style={styles.balanceCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.balanceTitle}>Your Balance</Text>
        <Text style={styles.balanceAmount}>₹{balance.toLocaleString()}</Text>
        <View style={styles.balanceActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleRecharge(500)}>
            <Text style={styles.actionButtonText}>+ ₹500</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleRecharge(1000)}>
            <Text style={styles.actionButtonText}>+ ₹1000</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddMoney')}>
            <Text style={styles.actionButtonText}>Custom</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'credits' && styles.activeTab]}
          onPress={() => setActiveTab('credits')}
        >
          <Text style={[styles.tabText, activeTab === 'credits' && styles.activeTabText]}>Credits</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'subscriptions' && styles.activeTab]}
          onPress={() => setActiveTab('subscriptions')}
        >
          <Text style={[styles.tabText, activeTab === 'subscriptions' && styles.activeTabText]}>Subscriptions</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {activeTab === 'credits' && (
          <View style={styles.creditsContainer}>
            <View style={styles.creditItem}>
              <View style={styles.creditIcon}>
                <FontAwesome name="ambulance" size={20} color="#D62828" />
              </View>
              <View style={styles.creditInfo}>
                <Text style={styles.creditTitle}>Emergency Credits</Text>
                <Text style={styles.creditAmount}>5 remaining</Text>
              </View>
              <TouchableOpacity style={styles.buyButton}>
                <Text style={styles.buyButtonText}>Buy More</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.creditItem}>
              <View style={styles.creditIcon}>
                <MaterialIcons name="priority-high" size={20} color="#0077B6" />
              </View>
              <View style={styles.creditInfo}>
                <Text style={styles.creditTitle}>Priority Response</Text>
                <Text style={styles.creditAmount}>2 remaining</Text>
              </View>
              <TouchableOpacity style={styles.buyButton}>
                <Text style={styles.buyButtonText}>Buy More</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'history' && (
          <View style={styles.historyContainer}>
            {transactions.map((txn) => (
              <View key={txn.id} style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <MaterialIcons 
                    name={txn.type === 'credit' ? 'arrow-downward' : 'arrow-upward'} 
                    size={20} 
                    color={txn.type === 'credit' ? '#4CAF50' : '#D62828'} 
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDesc}>{txn.description}</Text>
                  <Text style={styles.transactionDate}>{txn.date}</Text>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  txn.type === 'credit' ? styles.creditAmount : styles.debitAmount
                ]}>
                  {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                </Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'subscriptions' && (
          <View style={styles.subscriptionsContainer}>
            {subscriptionPlans.map((plan) => (
              <TouchableOpacity key={plan.id} style={styles.planCard}>
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                </View>
                <View style={styles.planFeatures}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={styles.subscribeButton}>
                  <Text style={styles.subscribeButtonText}>
                    {plan.id === 'premium' ? 'UPGRADE' : 'SUBSCRIBE'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins_600SemiBold',
  },
  balanceCard: {
    margin: 15,
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  balanceTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  balanceAmount: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 10,
    fontFamily: 'Poppins_700Bold',
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  actionButtonText: {
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#D62828',
  },
  tabText: {
    color: '#777',
    fontFamily: 'Poppins_500Medium',
  },
  activeTabText: {
    color: '#D62828',
    fontWeight: '600',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  creditsContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
  },
  creditItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
  },
  creditIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(214, 40, 40, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  creditInfo: {
    flex: 1,
  },
  creditTitle: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins_600SemiBold',
  },
  creditAmount: {
    fontSize: 14,
    color: '#777',
    fontFamily: 'Poppins_400Regular',
  },
  buyButton: {
    backgroundColor: 'rgba(0, 119, 182, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  buyButtonText: {
    color: '#0077B6',
    fontFamily: 'Poppins_600SemiBold',
  },
  historyContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
  },
  transactionItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 1,
  },
  transactionIcon: {
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins_500Medium',
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Poppins_400Regular',
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  creditAmount: {
    color: '#4CAF50',
  },
  debitAmount: {
    color: '#D62828',
  },
  subscriptionsContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  planName: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Poppins_600SemiBold',
  },
  planPrice: {
    fontSize: 16,
    color: '#D62828',
    fontFamily: 'Poppins_600SemiBold',
  },
  planFeatures: {
    marginVertical: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    fontFamily: 'Poppins_400Regular',
  },
  subscribeButton: {
    backgroundColor: '#D62828',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  subscribeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default WalletScreen;