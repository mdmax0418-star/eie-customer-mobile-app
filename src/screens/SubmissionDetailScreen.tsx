import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Screen } from '../components';
import {
  getDocumentDownloadUrl,
  getRequest,
  ServiceRequestDetail,
  SubmissionDocument,
  SUBMISSION_STATUSES,
  SubmissionStatus,
  updateRequestStatus,
} from '../services';

interface SubmissionDetailScreenProps {
  token: string;
  submissionId: number | string;
  onBack: () => void;
}

export function SubmissionDetailScreen({
  token,
  submissionId,
  onBack,
}: SubmissionDetailScreenProps) {
  const [submission, setSubmission] = useState<ServiceRequestDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isStatusPickerVisible, setIsStatusPickerVisible] = useState(false);
  const [openingDocumentId, setOpeningDocumentId] = useState<number | string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSubmission = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getRequest(token, submissionId);
      setSubmission(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load submission.');
    } finally {
      setIsLoading(false);
    }
  }, [submissionId, token]);

  useEffect(() => {
    loadSubmission();
  }, [loadSubmission]);

  const handleUpdateStatus = async (status: SubmissionStatus) => {
    if (!submission || submission.status === status || isUpdatingStatus) {
      setIsStatusPickerVisible(false);
      return;
    }

    setIsUpdatingStatus(true);
    setError(null);

    try {
      const updated = await updateRequestStatus(token, submission.id, status);
      setSubmission(currentSubmission =>
        currentSubmission ? { ...currentSubmission, status: updated.status } : currentSubmission,
      );
      setIsStatusPickerVisible(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleOpenDocument = async (document: SubmissionDocument) => {
    const downloadUrl = getDocumentDownloadUrl(document);
    if (!downloadUrl) {
      Alert.alert('Document unavailable', 'This document does not have a download link.');
      return;
    }

    setOpeningDocumentId(document.id);

    try {
      const response = await fetch(downloadUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Document download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const localUrl = createObjectUrl(blob) ?? (await createDataUrl(blob));

      if (!localUrl) {
        throw new Error('This device cannot create a local document preview.');
      }

      await Linking.openURL(localUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to open document.';
      Alert.alert('Unable to open document', message);
    } finally {
      setOpeningDocumentId(null);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹ Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Submission Detail</Text>
      </View>

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator color="#1d4ed8" size="large" />
          <Text style={styles.loaderText}>Loading submission…</Text>
        </View>
      ) : error && !submission ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={loadSubmission}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : submission ? (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.titleCard}>
              <Text style={styles.eyebrow}>#{submission.id}</Text>
              <Text style={styles.title}>{submission.fullName}</Text>
              <Text style={styles.submittedDate}>Submitted {formatDate(submission.submittedAt)}</Text>

              <View style={styles.statusRow}>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>{submission.status}</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  disabled={isUpdatingStatus}
                  onPress={() => setIsStatusPickerVisible(true)}
                  style={({ pressed }) => [
                    styles.changeStatusButton,
                    isUpdatingStatus && styles.disabled,
                    pressed && styles.pressed,
                  ]}
                >
                  {isUpdatingStatus ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.changeStatusText}>Update status</Text>
                  )}
                </Pressable>
              </View>
            </View>

            {error ? <Text style={styles.inlineError}>{error}</Text> : null}

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Customer</Text>
              <DetailRow label="Full name" value={submission.fullName} />
              <DetailRow label="Phone" value={submission.phoneNumber} />
              <DetailRow label="Service" value={formatService(submission.service)} />
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Documents</Text>
              {submission.documents.length === 0 ? (
                <Text style={styles.emptyText}>No documents were attached to this submission.</Text>
              ) : (
                submission.documents.map(document => (
                  <View key={String(document.id)} style={styles.documentRow}>
                    <View style={styles.documentInfo}>
                      <Text numberOfLines={2} style={styles.documentName}>
                        {document.originalName || 'Customer document'}
                      </Text>
                      <Text style={styles.documentMeta}>
                        {document.mimeType || 'Unknown type'} · {formatFileSize(document.size)}
                      </Text>
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      disabled={openingDocumentId === document.id}
                      onPress={() => handleOpenDocument(document)}
                      style={({ pressed }) => [
                        styles.documentButton,
                        openingDocumentId === document.id && styles.disabled,
                        pressed && styles.pressed,
                      ]}
                    >
                      {openingDocumentId === document.id ? (
                        <ActivityIndicator color="#1d4ed8" />
                      ) : (
                        <Text style={styles.documentButtonText}>Open</Text>
                      )}
                    </Pressable>
                  </View>
                ))
              )}
              {Platform.OS !== 'web' ? (
                <Text style={styles.documentHelp}>
                  Documents are fetched with your admin session before opening in the device viewer.
                </Text>
              ) : null}
            </View>
          </ScrollView>

          <Modal
            animationType="slide"
            onRequestClose={() => setIsStatusPickerVisible(false)}
            transparent
            visible={isStatusPickerVisible}
          >
            <Pressable
              onPress={() => setIsStatusPickerVisible(false)}
              style={styles.modalBackdrop}
            >
              <Pressable style={styles.modalCard}>
                <Text style={styles.modalTitle}>Update status</Text>
                {SUBMISSION_STATUSES.map(status => (
                  <Pressable
                    accessibilityRole="button"
                    disabled={isUpdatingStatus}
                    key={status}
                    onPress={() => handleUpdateStatus(status)}
                    style={[
                      styles.statusOption,
                      submission.status === status && styles.statusOptionSelected,
                    ]}
                  >
                    <Text style={styles.statusOptionText}>{status}</Text>
                  </Pressable>
                ))}
              </Pressable>
            </Pressable>
          </Modal>
        </>
      ) : null}
    </Screen>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function createObjectUrl(blob: Blob) {
  const urlApi = globalThis.URL as typeof URL & {
    createObjectURL?: (blob: Blob) => string;
  };

  if (typeof urlApi?.createObjectURL === 'function') {
    return urlApi.createObjectURL(blob);
  }

  return null;
}

function createDataUrl(blob: Blob): Promise<string | null> {
  if (typeof FileReader === 'undefined') {
    return Promise.resolve(null);
  }

  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onerror = () => resolve(null);
    reader.onloadend = () => {
      resolve(typeof reader.result === 'string' ? reader.result : null);
    };
    reader.readAsDataURL(blob);
  });
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
    dateStyle: 'full',
    timeStyle: 'short',
  });
}

function formatService(service: string) {
  return service
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatFileSize(size?: number) {
  if (!size) {
    return 'Size unavailable';
  }

  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#1d4ed8',
    fontSize: 17,
    fontWeight: '800',
  },
  headerTitle: {
    color: '#111827',
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
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
  content: {
    gap: 16,
    paddingBottom: 40,
    paddingTop: 18,
  },
  titleCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    gap: 8,
    padding: 20,
  },
  eyebrow: {
    color: '#93c5fd',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  submittedDate: {
    color: '#d1d5db',
    fontSize: 14,
  },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statusPill: {
    backgroundColor: '#dbeafe',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusPillText: {
    color: '#1d4ed8',
    fontSize: 13,
    fontWeight: '800',
  },
  changeStatusButton: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
  },
  changeStatusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    elevation: 3,
    gap: 14,
    padding: 18,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
  },
  detailRow: {
    borderTopColor: '#f3f4f6',
    borderTopWidth: 1,
    gap: 4,
    paddingTop: 12,
  },
  detailLabel: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  detailValue: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  documentRow: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
  },
  documentMeta: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
  documentButton: {
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 42,
    minWidth: 72,
    paddingHorizontal: 12,
  },
  documentButtonText: {
    color: '#1d4ed8',
    fontSize: 13,
    fontWeight: '800',
  },
  documentHelp: {
    color: '#6b7280',
    fontSize: 12,
    lineHeight: 18,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
  },
  errorCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 16,
    gap: 8,
    marginTop: 18,
    padding: 14,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
  },
  inlineError: {
    backgroundColor: '#fef2f2',
    borderRadius: 14,
    color: '#b91c1c',
    fontSize: 14,
    padding: 12,
  },
  retryText: {
    color: '#1d4ed8',
    fontSize: 14,
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.82,
  },
  modalBackdrop: {
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 10,
    padding: 20,
  },
  modalTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  statusOption: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 16,
  },
  statusOptionSelected: {
    backgroundColor: '#dbeafe',
  },
  statusOptionText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
});
