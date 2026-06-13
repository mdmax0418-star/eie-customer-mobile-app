import type { DocumentPickerResponse } from '@react-native-documents/picker';
import { API_BASE_URL, apiRequest } from './api';

export type SubmissionStatus =
  | 'New'
  | 'In Progress'
  | 'Awaiting Documents'
  | 'Complete'
  | 'Cancelled';

export const SUBMISSION_STATUSES: SubmissionStatus[] = [
  'New',
  'In Progress',
  'Awaiting Documents',
  'Complete',
  'Cancelled',
];

export interface SubmissionDocument {
  id: number | string;
  originalName: string;
  mimeType: string;
  size: number;
  url?: string;
  createdAt?: string;
}

export interface ServiceRequest {
  id: number | string;
  fullName: string;
  phoneNumber: string;
  service: string;
  status: SubmissionStatus | string;
  submittedAt: string;
}

export interface ServiceRequestDetail extends ServiceRequest {
  documents: SubmissionDocument[];
}

export interface NewServiceRequest {
  fullName: string;
  phoneNumber: string;
  service: string;
  documents: DocumentPickerResponse[];
}

export interface CreateRequestResponse {
  submission: ServiceRequest;
  documents: SubmissionDocument[];
}

export async function listRequests(token: string): Promise<ServiceRequest[]> {
  const result = await apiRequest<{ submissions: ServiceRequest[] }>(
    '/api/v1/submissions',
    { token },
  );
  return result.submissions;
}

export async function getRequest(
  token: string,
  submissionId: number | string,
): Promise<ServiceRequestDetail> {
  const result = await apiRequest<{ submission: ServiceRequestDetail }>(
    `/api/v1/submissions/${submissionId}`,
    { token },
  );
  return {
    ...result.submission,
    documents: result.submission.documents ?? [],
  };
}

export async function updateRequestStatus(
  token: string,
  submissionId: number | string,
  status: SubmissionStatus,
): Promise<{ id: number | string; status: SubmissionStatus }> {
  const result = await apiRequest<{
    submission: { id: number | string; status: SubmissionStatus };
  }>(`/api/v1/submissions/${submissionId}/status`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ status }),
  });

  return result.submission;
}

export function getDocumentDownloadUrl(document: SubmissionDocument): string | null {
  if (document.url) {
    return document.url;
  }

  if (!document.id) {
    return null;
  }

  return `${API_BASE_URL}/api/v1/documents/${document.id}/download`;
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
