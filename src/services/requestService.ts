import type { DocumentPickerResponse } from '@react-native-documents/picker';
import { apiRequest } from './api';

export interface ServiceRequest {
  id: string;
  fullName: string;
  phoneNumber: string;
  service: string;
  status: string;
  submittedAt: string;
}

export interface NewServiceRequest {
  fullName: string;
  phoneNumber: string;
  service: string;
  documents: DocumentPickerResponse[];
}

export interface CreateRequestResponse {
  submission: ServiceRequest;
  documents: Array<{
    id: string;
    originalName: string;
    mimeType: string;
    size: number;
    downloadUrl?: string;
  }>;
}

export async function listRequests(token: string): Promise<ServiceRequest[]> {
  const result = await apiRequest<{ submissions: ServiceRequest[] }>(
    '/api/v1/submissions',
    { token },
  );
  return result.submissions;
}

export async function createRequest(
  request: NewServiceRequest,
): Promise<CreateRequestResponse> {
  const formData = new FormData();
  formData.append('fullName', request.fullName);
  formData.append('phoneNumber', request.phoneNumber);
  formData.append('service', request.service);

  request.documents.forEach((document, index) => {
    formData.append('documents', {
      uri: document.uri,
      name: document.name || `document-${index + 1}`,
      type: document.type || 'application/octet-stream',
    } as unknown as Blob);
  });

  return apiRequest<CreateRequestResponse>('/api/v1/submissions', {
    method: 'POST',
    body: formData,
  });
}
