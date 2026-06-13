import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Screen } from '../components';
import { clearStoredAuthToken, listRequests, ServiceRequest } from '../services';
import { SubmissionDetailScreen } from './SubmissionDetailScreen';

interface AdminDashboardScreenProps {
  token: string;
  onLogout: () => void;
}

export function AdminDashboardScreen({ token, onLogout }: AdminDashboardScreenProps) {
  const [submissions, setSubmissions] = useState<ServiceRequest[]>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const loadSubmissions = useCallback(
    async (refreshing = false) => {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const results = await listRequests(token);
        setSubmissions(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load submissions.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [token],
  );

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const filteredSubmissions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return submissions;
    }

    return submissions.filter(submission =>
      [
        submission.id,
        submission.fullName,
        submission.phoneNumber,
        submission.service,
        submission.status,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, submissions]);

  const summary = useMemo(() => {
    const openCount = submissions.filter(
      submission => submission.status !== 'Complete' && submission.status !== 'Cancelled',
    ).length;
    const completeCount = submissions.filter(
      submission => submission.status === 'Complete',
    ).length;

    return { total: submissions.length, openCount, completeCount };
  }, [submissions]);

  const handleLogout = async () => {
    await clearStoredAuthToken();
    onLogout();
  };

  if (selectedSubmissionId !== null) {
    return (
      <SubmissionDetailScreen
        onBack={() => {
          setSelectedSubmissionId(null);
          loadSubmissions(true);
        }}
        submissionId={selectedSubmissionId}
        token={token}
      />
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>Admin</Text>
          <Text style={styles.title}>Customer Submissions</Text>
          <Text style={styles.subtitle}>Review customer requests, documents, and current status.</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </View>

      <View style={styles.summaryRow}>
        <SummaryCard label="Total" value={summary.total} />
        <SummaryCard label="Open" value={summary.openCount} />
        <SummaryCard label="Complete" value={summary.completeCount} />
      </View>

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setQuery}
        placeholder="Search by name, phone, service, status, or ID"
        placeholderTextColor="#9ca3af"
        style={styles.searchInput}
        value={query}
      />

      {error ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={() => loadSubmissions()}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : null}

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator color="#1d4ed8" size="large" />
          <Text style={styles.loaderText}>Loading submissions…</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={filteredSubmissions}
          keyExtractor={item => String(item.id)}
          refreshControl={
            <RefreshControl
              onRefresh={() => loadSubmissions(true)}
              refreshing={isRefreshing}
              tintColor="#1d4ed8"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No submissions found</Text>
              <Text style={styles.emptyText}>
                {query ? 'Try a different search.' : 'New customer submissions will appear here.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <SubmissionRow
              submission={item}
              onPress={() => setSelectedSubmissionId(item.id)}
            />
          )}
        />
      )}
    </Screen>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function SubmissionRow({
  submission,
  onPress,
}: {
  submission: ServiceRequest;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.rowCard, pressed && styles.pressed]}
    >
      <View style={styles.rowHeader}>
        <View style={styles.rowTitleWrap}>
          <Text numberOfLines={1} style={styles.rowTitle}>
            {submission.fullName}
          </Text>
          <Text style={styles.rowId}>#{submission.id}</Text>
        </View>
        <StatusPill status={submission.status} />
      </View>
      <Text style={styles.rowMeta}>{formatService(submission.service)}</Text>
      <Text style={styles.rowMeta}>{submission.phoneNumber}</Text>
      <Text style={styles.rowDate}>Submitted {formatDate(submission.submittedAt)}</Text>
    </Pressable>
  );
}

function StatusPill({ status }: { status: string }) {
  const color = getStatusColor(status);
  return (
    <View style={[styles.statusPill, { backgroundColor: color.backgroundColor }]}>
      <Text style={[styles.statusText, { color: color.color }]}>{status}</Text>
    </View>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Complete':
      return { backgroundColor: '#dcfce7', color: '#166534' };
    case 'In Progress':
      return { backgroundColor: '#dbeafe', color: '#1d4ed8' };
    case 'Awaiting Documents':
      return { backgroundColor: '#fef3c7', color: '#92400e' };
    case 'Cancelled':
      return { backgroundColor: '#fee2e2', color: '#991b1b' };
    default:
      return { backgroundColor: '#eef2ff', color: '#3730a3' };
  }
}

function formatDate(value?: string) {
  if (!value) {
    return 'date unavailable';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function formatService(service: string) {
  return service
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 4,
  },
  subtitle: {
    color: '#4b5563',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  logoutText: {
    color: '#1d4ed8',
    fontSize: 14,
    fontWeight: '800',
    paddingTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    elevation: 2,
    flex: 1,
    padding: 14,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  summaryValue: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '800',
  },
  summaryLabel: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderRadius: 16,
    borderWidth: 1,
    color: '#111827',
    fontSize: 15,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  errorCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 16,
    gap: 8,
    marginTop: 14,
    padding: 14,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
  },
  retryText: {
    color: '#1d4ed8',
    fontSize: 14,
    fontWeight: '800',
  },
  loader: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loaderText: {
    color: '#4b5563',
    marginTop: 12,
  },
  listContent: {
    gap: 12,
    paddingBottom: 36,
    paddingTop: 16,
  },
  rowCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    elevation: 3,
    gap: 6,
    padding: 16,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
  },
  rowHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  rowTitleWrap: {
    flex: 1,
  },
  rowTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
  },
  rowId: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  rowMeta: {
    color: '#374151',
    fontSize: 14,
  },
  rowDate: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
  },
  emptyTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.84,
  },
});
