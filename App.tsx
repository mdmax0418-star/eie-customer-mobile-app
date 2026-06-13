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
            <Text style={styles.loaderText}>Getting your request ready…</Text>
          </View>
        ) : authToken && isAdmin ? (
          <AdminDashboardScreen onLogout={handleLogout} token={authToken} />
        ) : authToken ? (
          <NewRequestScreen onLogout={handleLogout} />
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
    gap: 12,
    justifyContent: 'center',
  },
  loaderText: {
    color: '#4b5563',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default App;
