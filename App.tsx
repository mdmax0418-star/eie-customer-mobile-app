import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AdminDashboardScreen, LoginScreen, NewRequestScreen } from './src/screens';
import {
  AuthUser,
  clearStoredAuthToken,
  getCurrentUser,
  getStoredAuthToken,
  LoginResponse,
} from './src/services';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await getStoredAuthToken();
        if (token) {
          const response = await getCurrentUser(token);
          setAuthToken(token);
          setCurrentUser(response.user);
        }
      } catch {
        await clearStoredAuthToken();
      } finally {
        setIsLoadingAuth(false);
      }
    };

    restoreSession();
  }, []);

  const handleLoginSuccess = (auth: LoginResponse) => {
    setAuthToken(auth.token);
    setCurrentUser(auth.user);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        {isLoadingAuth ? (
          <View style={styles.loader}>
            <ActivityIndicator color="#1d4ed8" size="large" />
          </View>
        ) : authToken && isAdmin ? (
          <AdminDashboardScreen onLogout={handleLogout} token={authToken} />
        ) : authToken ? (
          <View style={styles.protectedMessage}>
            <Text style={styles.protectedTitle}>Admin access required</Text>
            <Text style={styles.protectedBody}>
              This dashboard is only available to authenticated admin users.
            </Text>
            <NewRequestScreen onLogout={handleLogout} />
          </View>
        ) : (
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
    flex: 1,
    justifyContent: 'center',
  },
  protectedMessage: {
    flex: 1,
  },
  protectedTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  protectedBody: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 24,
    paddingTop: 6,
  },
});

export default App;
