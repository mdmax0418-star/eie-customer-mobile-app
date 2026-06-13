import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen, NewRequestScreen } from './src/screens';
import { clearStoredAuthToken, getCurrentUser, getStoredAuthToken } from './src/services';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await getStoredAuthToken();
        if (token) {
          await getCurrentUser(token);
          setIsAuthenticated(true);
        }
      } catch {
        await clearStoredAuthToken();
      } finally {
        setIsLoadingAuth(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        {isLoadingAuth ? (
          <View style={styles.loader}>
            <ActivityIndicator color="#1d4ed8" size="large" />
          </View>
        ) : isAuthenticated ? (
          <NewRequestScreen onLogout={() => setIsAuthenticated(false)} />
        ) : (
          <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />
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
});

export default App;
