import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  DocumentPickerResponse,
  isErrorWithCode,
  errorCodes,
  pick,
  types,
} from '@react-native-documents/picker';
import { Screen } from '../components';
import { clearStoredAuthToken, createRequest } from '../services';

const SERVICES = [
  { label: 'Registration Renewal', value: 'renewal' },
  { label: 'Title Transfer', value: 'transfer' },
  { label: 'Replacement Plates/Stickers', value: 'replacement' },
  { label: 'VIN Verification', value: 'vin' },
  { label: 'Out-of-State Transfer', value: 'out-of-state' },
];

interface NewRequestScreenProps {
  onLogout: () => void;
}

export function NewRequestScreen({ onLogout }: NewRequestScreenProps) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [service, setService] = useState('');
  const [documents, setDocuments] = useState<DocumentPickerResponse[]>([]);
  const [isServicePickerVisible, setIsServicePickerVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedServiceLabel = useMemo(
    () => SERVICES.find(item => item.value === service)?.label,
    [service],
  );

  const isFormComplete =
    fullName.trim().length > 0 && phoneNumber.trim().length > 0 && !!service;

  const handlePickDocuments = async () => {
    try {
      const pickedDocuments = await pick({
        allowMultiSelection: true,
        type: [types.pdf, types.images],
      });
      setDocuments(currentDocuments => {
        const nextDocuments = [...currentDocuments, ...pickedDocuments].slice(0, 5);
        if (currentDocuments.length + pickedDocuments.length > 5) {
          Alert.alert('Document limit', 'You can upload up to 5 documents.');
        }
        return nextDocuments;
      });
    } catch (err) {
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
        return;
      }
      setError(err instanceof Error ? err.message : 'Unable to select documents.');
    }
  };

  const handleRemoveDocument = (uri: string) => {
    setDocuments(currentDocuments =>
      currentDocuments.filter(document => document.uri !== uri),
    );
  };

  const resetForm = () => {
    setFullName('');
    setPhoneNumber('');
    setService('');
    setDocuments([]);
  };

  const handleSubmit = async () => {
    if (!isFormComplete || isSubmitting) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await createRequest({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        service,
        documents,
      });
      resetForm();
      Alert.alert(
        'Request submitted',
        `Your submission ID is ${response.submission.id}. Documents uploaded: ${
          response.documents?.length ?? 0
        }`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await clearStoredAuthToken();
    onLogout();
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>EIE Auto Registration</Text>
            <Text style={styles.title}>New Service Request</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={handleLogout}>
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </View>

        <Text style={styles.description}>
          Submit your request and attach any registration documents, IDs, or supporting files.
        </Text>

        <View style={styles.card}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Choose a Service</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setIsServicePickerVisible(true)}
              style={styles.selectButton}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  !selectedServiceLabel && styles.placeholderText,
                ]}
              >
                {selectedServiceLabel || 'Select your service'}
              </Text>
              <Text style={styles.chevron}>⌄</Text>
            </Pressable>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Upload Documents</Text>
            <Pressable
              accessibilityRole="button"
              disabled={documents.length >= 5}
              onPress={handlePickDocuments}
              style={({ pressed }) => [
                styles.uploadBox,
                documents.length >= 5 && styles.uploadBoxDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.uploadTitle}>Select PDF or image files</Text>
              <Text style={styles.uploadHelp}>
                Optional · Up to 5 files · PDF, JPEG, PNG, WEBP, HEIC/HEIF
              </Text>
            </Pressable>
            {documents.map(document => (
              <View key={document.uri} style={styles.documentRow}>
                <View style={styles.documentInfo}>
                  <Text numberOfLines={1} style={styles.documentName}>
                    {document.name || 'Selected document'}
                  </Text>
                  <Text style={styles.documentMeta}>{formatFileSize(document.size)}</Text>
                </View>
                <Pressable onPress={() => handleRemoveDocument(document.uri)}>
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
            ))}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              autoCapitalize="words"
              editable={!isSubmitting}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              textContentType="name"
              value={fullName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              editable={!isSubmitting}
              keyboardType="phone-pad"
              onChangeText={setPhoneNumber}
              placeholder="Enter your phone number"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              textContentType="telephoneNumber"
              value={phoneNumber}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            accessibilityRole="button"
            disabled={!isFormComplete || isSubmitting}
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitButton,
              (!isFormComplete || isSubmitting) && styles.submitButtonDisabled,
              pressed && styles.pressed,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Request</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        onRequestClose={() => setIsServicePickerVisible(false)}
        transparent
        visible={isServicePickerVisible}
      >
        <Pressable
          onPress={() => setIsServicePickerVisible(false)}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose a Service</Text>
            {SERVICES.map(item => (
              <Pressable
                accessibilityRole="button"
                key={item.value}
                onPress={() => {
                  setService(item.value);
                  setIsServicePickerVisible(false);
                }}
                style={[
                  styles.serviceOption,
                  service === item.value && styles.serviceOptionSelected,
                ]}
              >
                <Text style={styles.serviceOptionText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}

function formatFileSize(size: number | null) {
  if (!size) {
    return 'Size unavailable';
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
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
  logoutText: {
    color: '#1d4ed8',
    fontSize: 14,
    fontWeight: '800',
    paddingTop: 8,
  },
  description: {
    color: '#4b5563',
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    elevation: 4,
    gap: 18,
    padding: 20,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '800',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
    borderRadius: 14,
    borderWidth: 1,
    color: '#111827',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectButton: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectButtonText: {
    color: '#111827',
    fontSize: 16,
  },
  placeholderText: {
    color: '#9ca3af',
  },
  chevron: {
    color: '#6b7280',
    fontSize: 22,
    fontWeight: '700',
  },
  uploadBox: {
    backgroundColor: '#eff6ff',
    borderColor: '#93c5fd',
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    padding: 18,
  },
  uploadBoxDisabled: {
    opacity: 0.55,
  },
  uploadTitle: {
    color: '#1d4ed8',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  uploadHelp: {
    color: '#4b5563',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
    textAlign: 'center',
  },
  documentRow: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    padding: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  documentMeta: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  removeText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '800',
  },
  error: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    color: '#b91c1c',
    fontSize: 14,
    padding: 12,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#1d4ed8',
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 54,
  },
  submitButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
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
  serviceOption: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 16,
  },
  serviceOptionSelected: {
    backgroundColor: '#dbeafe',
  },
  serviceOptionText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
});
